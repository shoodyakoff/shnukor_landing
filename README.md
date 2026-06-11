# Шнурок — умный подбор кроссовок

Лендинг-квиз: пользователь отвечает на несколько вопросов (размер, цвет, бюджет,
задача), свайпает визуальные стили и получает персональную подборку кроссовок.
Подбор приходит из внешнего API `shnurok-shipping.ru` через серверный прокси.

## Стек

- **TanStack Start** (React 19, file-based routing, SSR + prerender)
- **Vite 7** + **Tailwind CSS v4** + **shadcn/ui** (Radix)
- **Zod** — валидация входных данных серверного прокси
- Рантайм деплоя: **Nitro** (preset `vercel`)

## Быстрый старт

```bash
npm install
cp .env.example .env      # заполнить SNEAKERS_API_TOKEN
npm run dev               # http://localhost:8080  (base path "/")
```

### Переменные окружения

| Переменная            | Назначение                                              |
| --------------------- | ------------------------------------------------------- |
| `SNEAKERS_API_TOKEN`  | Приватный токен апстрим-API (только на сервере)         |
| `SNEAKERS_API_URL`    | URL апстрима (по умолчанию `…/api/sneakers.php`)         |
| `VITE_BASE_PATH`      | Base path, если хостинг под суб-путём (по умолчанию `/`) |

`.env` в `.gitignore` — токен никогда не попадает в репозиторий и в клиентский бандл.

## Скрипты

| Команда            | Что делает                          |
| ------------------ | ----------------------------------- |
| `npm run dev`      | Дев-сервер (Vite)                   |
| `npm run build`    | Прод-сборка (+ prerender главной)   |
| `npm run preview`  | Локальный предпросмотр сборки       |
| `npm run lint`     | ESLint                              |
| `npm run format`   | Prettier                            |

## Структура

```
src/
├─ routes/
│  ├─ __root.tsx          # html-оболочка, мета/OG, favicon, canonical
│  ├─ index.tsx           # главная (рендерит Flow)
│  └─ api/sneakers.ts     # серверный прокси к апстрим-API (токен + валидация)
├─ components/shnurok/    # экраны квиза, свайп-дек стилей, результаты, маппинг UI→API
├─ components/ui/          # shadcn/ui примитивы
├─ hooks/ lib/ assets/
└─ styles.css             # тема (токены --lace / --outsole / --mesh)
```

Логика квиза — стейт-машина по шагам в [`Flow.tsx`](src/components/shnurok/Flow.tsx):
`hero → size → color → price → task → (sport) → style → search → results/empty`.

## Серверный прокси `/api/sneakers`

Браузер ходит на свой же origin `POST /api/sneakers`; сервер валидирует тело
(zod), подставляет `Authorization: Bearer <token>` и проксирует запрос в апстрим.
Так приватный токен не покидает сервер. Эндпоинт намеренно **не** отдаёт
разрешающих CORS-заголовков (only same-origin), имеет таймаут, лимит размера тела
и best-effort rate-limit. Контракт полей — в
[`sneakers-mapping.ts`](src/components/shnurok/sneakers-mapping.ts) и
[`README_DEPLOY.md`](README_DEPLOY.md).

## Деплой

Прод — **Vercel** (нужен серверный рантайм для прокси). Подробности и список env —
в [`README_DEPLOY.md`](README_DEPLOY.md). Статический GitHub Pages не подходит:
там прокси не работает и подбор всегда пустой.

## Документация

- [`docs/prod-readiness-review.md`](docs/prod-readiness-review.md) — аудит готовности к проду, чек-лист и дорожная карта
- [`README_DEPLOY.md`](README_DEPLOY.md) — инструкция по деплою и контракт API
- `docs/` — история ТЗ и маппинга API
