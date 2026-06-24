# Self-hosting «Шнурок» через Docker

Это руководство для размещения лендинга на **своём сервере** (а не на Vercel).
Стек собирается в standalone Node-сервер (Nitro `node-server`) и публикуется
через nginx.

## Что входит в стек

| Сервис | Роль |
|---|---|
| `app` | TanStack Start / Nitro node-сервер: SSR главной, статика и серверный прокси `/api/sneakers` (инжектит приватный токен). Слушает `:3000` внутри сети Docker. |
| `nginx` | Публичная точка входа: TLS, HSTS, gzip, кэш хешированных ассетов, анти-спуфинг `X-Forwarded-For`, rate-limit. Публикует `:80` (и `:443` после настройки TLS). |

**Разделение секретов и сборки:**
- `VITE_SITE_URL` — **build-time**: вшивается в SSR-мета, `robots.txt`, `sitemap.xml`.
- `SNEAKERS_API_TOKEN` — **runtime-секрет**: никогда не попадает в образ, передаётся
  контейнеру через `.env`. В клиентский бандл не утекает.

## Требования

- Docker Engine 24+ и Docker Compose v2 (`docker compose`, не `docker-compose`).
- Открытые порты 80 (и 443 для HTTPS).
- Сетевой доступ с сервера до upstream API (`SNEAKERS_API_URL`).

## Быстрый старт

```bash
# 1. Конфигурация
cp .env.example .env
#   заполнить:
#     SNEAKERS_API_TOKEN=<реальный токен>
#     VITE_SITE_URL=https://ваш-домен.ru   # для корректных og/canonical/sitemap

# 2. Сборка и запуск
docker compose up -d --build

# 3. Проверка
curl -I http://localhost/             # 200 + security-заголовки
curl  http://localhost/api/health     # {"status":"ok",...}
```

Открыть `http://<IP-сервера>/` — должна отрисоваться главная и пройти весь флоу
подбора (включая реальную выдачу из каталога, если токен верный).

## Включение HTTPS (Let's Encrypt)

1. Направить A/AAAA-записи домена на сервер.
2. Выпустить сертификат, например:
   ```bash
   docker run --rm -p 80:80 \
     -v "$PWD/docker/certs:/etc/letsencrypt" \
     certbot/certbot certonly --standalone -d ваш-домен.ru -d www.ваш-домен.ru
   ```
   (или системный `certbot`; положить `fullchain.pem` и `privkey.pem` в `docker/certs/`).
3. В `docker/nginx.conf`: заменить серверный блок `listen 80` на редирект и
   раскомментировать блок `listen 443 ssl` (там же включается HSTS).
4. В `docker-compose.yml`: раскомментировать `- "443:443"` и volume `./docker/certs`.
5. `docker compose up -d` — без пересборки.

> HSTS добавляется **только** на TLS-терминаторе (nginx, блок 443). Пять
> content-заголовков (CSP, X-Frame-Options, X-Content-Type-Options,
> Referrer-Policy, Permissions-Policy) ставит само приложение
> (`vite.config.ts` → `SECURITY_HEADERS`) — они применяются и без nginx.

## Обновление версии

```bash
git pull
docker compose up -d --build
```

Откат: `git checkout <предыдущий-тег> && docker compose up -d --build`.

## Эксплуатация

```bash
docker compose ps           # статус + healthcheck (app должен быть healthy)
docker compose logs -f app  # логи приложения
docker compose logs -f nginx
docker compose down         # остановить
```

- **Health:** `GET /api/health` отвечает `200 {"status":"ok"}` без обращения к
  upstream — годится для внешнего uptime-мониторинга (UptimeRobot и т.п.).
- **Секрет:** `.env` держать с правами `600`, владелец — сервисный пользователь;
  ротация токена = правка `.env` + `docker compose up -d` (пересборка не нужна,
  токен читается в рантайме).
- **Rate-limit:** двойной — in-memory в приложении + `limit_req` в nginx
  (30 req/min на IP). За внешним CDN/LB поправьте `X-Forwarded-For` в
  `docker/nginx.conf` (см. комментарий про `set_real_ip_from`).

## Альтернатива: один контейнер без nginx

Если TLS/проксирование уже есть на стороне сервера (внешний nginx/Caddy/Traefik):

```bash
docker build -t shnurok-app --build-arg VITE_SITE_URL=https://ваш-домен.ru .
docker run -d --name shnurok -p 3000:3000 \
  -e SNEAKERS_API_TOKEN=<токен> \
  -e SNEAKERS_API_URL=https://shnurok-shipping.ru/api/sneakers.php \
  shnurok-app
```

Приложение само отдаёт пять security-заголовков. **HSTS** в этом случае должен
добавить ваш внешний прокси (он же терминирует TLS).

## Чек-лист приёмки (acceptance)

```bash
# 1. Сервер поднялся, health зелёный
docker compose ps                                  # app: healthy
curl -fsS http://localhost/api/health              # {"status":"ok",...}

# 2. Security-заголовки на месте (вкл. ошибки)
curl -sI http://localhost/        | grep -iE 'content-security-policy|x-frame-options|x-content-type|referrer-policy|permissions-policy'
curl -sI http://localhost/api/health | grep -i x-frame-options
#   после включения TLS: securityheaders.com по домену -> рейтинг A/A+

# 3. Токен НЕ утёк в клиент
docker compose exec app sh -c "grep -rl 'SNEAKERS_API_TOKEN\|Bearer ' .output/public" || echo "OK: токена нет в статике"
#   в браузере DevTools -> Network -> запрос /api/sneakers без заголовка Authorization

# 4. Прокси реально ходит в каталог (валидный токен)
curl -s -X POST http://localhost/api/sneakers -H 'Content-Type: application/json' -d '{"limit":1}'
#   ожидаем JSON-выдачу; при неверном токене upstream вернёт {"success":false,...}

# 5. Валидация ввода
curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost/api/sneakers \
  -H 'Content-Type: application/json' -d '{"limit":"oops"}'   # ожидаем 400

# 6. Домен в мете заменён (нет vercel.app)
curl -s http://localhost/ | grep -aoE 'og:url" content="[^"]*"'   # ваш домен
```

## Известные особенности

- Базовый образ — `node:22-bookworm-slim` (glibc), под целевой Node 22.
- `VITE_SITE_URL` — build-time: смена домена требует пересборки (`--build`).
- Конфиг переключается на node-server через `NITRO_PRESET=node-server` (его задаёт
  Dockerfile). Сборка на Vercel (`VERCEL=1`) и локальный `npm run dev` не затронуты.
