# Итоговый план тестирования и приёмки — лендинг «Шнурок» (self-hosting)

## Вердикт

**Проект НЕ готов к передаче на свой сервер «как есть».** Кодовая база приложения качественная (серверный прокси `/api/sneakers` грамотно захардён, токен не утекает в клиент и не попадал в git, PII не собирается), но вся текущая сборка и безопасность завязаны на платформу Vercel. При переносе на VPS заказчика приложение в текущем виде **не поднимет HTTP-порт** и **потеряет все security-заголовки**. Это инфраструктурные блокеры, не баги кода.

### Блокеры P0 (закрыть ДО передачи)

1. **Сборка не даёт запускаемый Node-сервер.** В `vite.config.ts` плагин `nitro({preset:'vercel'})` подключается только при `process.env.VERCEL`. Без него обычный `npm run build` собирает `dist/server/server.js`, который экспортирует web-`fetch`-handler и **не слушает порт**; `.output/server/index.mjs` не создаётся. На VPS прокси `/api/sneakers` не работает → каталог всегда пустой. **Фикс: добавить ветку `preset: 'node-server'`** (через `NITRO_PRESET`/`DEPLOY_TARGET`), собрать без `VERCEL`, запускать `node .output/server/index.mjs`.

2. **Security-заголовки живут только в `vercel.json`.** CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy при self-host **исчезнут полностью**. **Фикс: перенести на Nginx (`add_header ... always`) или в Nitro `routeRules`/middleware.** Заодно почистить CSP: `fonts.googleapis.com`/`fonts.gstatic.com` — мёртвые директивы (шрифты теперь self-host).

3. **Нет инфраструктуры self-host.** В репозитории отсутствуют Dockerfile, nginx.conf, systemd-unit/pm2-конфиг, health-эндпоинт и инструкция по развёртыванию на своём сервере. README описывает только Vercel.

4. **Публичный домен захардкожен на Vercel.** `SITE_URL='https://shnukor-landing.vercel.app'` (с опечаткой `shnukor`) в `src/lib/site.ts`, `public/robots.txt`, `public/sitemap.xml` → битый canonical/OG/sitemap после переезда.

5. **Токен `SNEAKERS_API_TOKEN` при передаче.** Локальный `.env` (права 644) содержит реальный секрет. Без ротации прежний владелец сохранит доступ к upstream. Передавать только `.env.example` с пустым токеном, токен — отдельным защищённым каналом, права на сервере 600.

---

## Карта рисков (сдедуплено по всем направлениям, сортировка по severity)

| # | Риск | Severity | Где | Что делать |
|---|------|----------|-----|-----------|
| 1 | Сборка не создаёт серверный рантайм с listener вне Vercel | **Blocker** | `vite.config.ts:12-28`; `dist/server/server.js:998` | Добавить `nitro({preset:'node-server'})` для self-host; собрать без `VERCEL`; запуск `node .output/server/index.mjs` под pm2/systemd |
| 2 | Security-заголовки только в `vercel.json` — теряются при self-host | **Blocker** | `vercel.json:5-23`; нет `routeRules` | Перенести в Nginx `add_header always` или Nitro middleware; верифицировать на securityheaders.com |
| 3 | Нет Dockerfile / nginx / systemd / pm2 / health-эндпоинта / self-host README | **High** | `git ls-files`; `README_DEPLOY.md` | Подготовить infra-пакет: build→`.output`, systemd/pm2, nginx reverse-proxy + TLS, опц. Dockerfile, `README_SELFHOST.md` |
| 4 | Зависимость от upstream `shnurok-shipping.ru`: владение, egress, поведение при сбое | **High** | `src/routes/api/sneakers.ts:4,71-90` | На приёмке зафиксировать владельца домена/токена, нужен ли whitelist IP сервера, проверить доступность с прод-сервера (egress/firewall) |
| 5 | Секрет на сервере: env должен быть 600, вне git/образа, с ротацией | **High** | `.env` (644); `.gitignore:21-23` | `/etc/shnurok.env` chmod 600 + systemd `EnvironmentFile`; описать ротацию (замена env + рестарт); не логировать Authorization |
| 6 | Rate-limit обходится спуфингом `X-Forwarded-For`, in-memory/per-instance | **High** | `src/routes/api/sneakers.ts:104-128` | Слушать `127.0.0.1`; Nginx `proxy_set_header X-Forwarded-For $remote_addr` (перезапись); вынести лимит в Nginx `limit_req_zone`; документировать сброс при рестарте |
| 7 | Нет состояния ошибки API — любой сбой = «ничего не найдено», нет retry запроса | **High** | `sneakers-api.ts:53-56`; `FlowResultScreens.tsx:70-72` | Различать `ok`/`empty`/`error`; экран ошибки с «Повторить поиск» (без сброса `sel`) |
| 8 | Свайп-дека недоступна с клавиатуры/скринридера | **High** | `StyleDeck.tsx:60-83,169-182` | Кнопки like/dislike (есть) — валидная альтернатива; добавить `aria-label` с названием стиля, счётчик «Стиль N из M» в `aria-live`, не прятать подсказку на мобиле |
| 9 | Загрузка/смена шага не объявляются скринридеру (нет `aria-live`) | **High** | grep `aria-live`/`role=status` → пусто; `FlowResultScreens.tsx:33-130` | Обернуть статус и заголовки в `role=status`/`aria-live=polite`; переносить фокус на h1 нового шага |
| 10 | `prefers-reduced-motion` не учтён при тяжёлой Hero-анимации + Lottie | **High** | grep → 0; `Hero.tsx:96-183,280-288`; `styles.css:262` | Глобальный `@media (prefers-reduced-motion: reduce)`; отключать Lottie autoplay/loop через `matchMedia` |
| 11 | Тап-таргеты контактов 28-32px (<44px) | **High** | `Contacts.tsx:52` | Увеличить зону до ≥44×44 (`h-11 w-11` или padding) в шапках Hero/Flow/Search/Results |
| 12 | Нет safe-area-inset под фикс-панелью свайпа (iOS notch/home-indicator) | **High** | `StyleDeck.tsx:87`; `__root.tsx:31` (нет `viewport-fit=cover`) | Добавить `viewport-fit=cover` + `padding-bottom: max(0.75rem, env(safe-area-inset-bottom))` |
| 13 | Тяжёлые hero-изображения: 3 PNG по 2.2-2.6MB + Lottie 263KB статически в бандле | **High** | `Hero.tsx:2,61-74,354-365` | Конвертировать в webp ~300-400px, `loading=lazy`+`width/height`; вынести `boots.json` из статического импорта |
| 14 | Тесты не запускаются (нет скрипта `test`, нет раннера), часть устарела | **Medium** | `package.json:7-14`; `responsive-layout.test.tsx:68-69` | Добавить devDep `tsx` + `"test":"tsx --test 'src/**/*.test.{ts,tsx}'"`; актуализировать ассерты; либо явно пометить тесты декоративными |
| 15 | Lint падает: 2 ошибки prettier + 6 warnings | **Medium** | `ui.tsx:226`; `sneakers-mapping.test.ts:205` | `npm run format` (автофикс); заглушить react-refresh для `src/components/ui/**` |
| 16 | URL товара из upstream рендерится в `href` без проверки схемы (`javascript:`/`data:`) | **Medium** | `sneakers-api.ts:129-137`; `ProductCards.tsx:131-139` | В `normalizeProductUrl` whitelist `http:`/`https:`; добавить `noopener` |
| 17 | CSP содержит `script-src 'unsafe-inline'` — ослабляет анти-XSS | **Medium** | `vercel.json:19-21` | При переносе проверить, обходится ли без `unsafe-inline` (nonce/hash для гидрейшена); иначе оставить осознанно и задокументировать |
| 18 | Провал планшета-портрета 768-1023px: lg-сетки/`SelectionAside` на ещё узком экране | **Medium** | `ui.tsx:224,281`; `Hero.tsx:21` | Проверить 768/820/834 портрет+ландшафт; при необходимости ввести md-ступень |
| 19 | Узкие 320-360px: `grid-cols-5` размеры, `grid-cols-4` длинные названия цветов | **Medium** | `FlowChoiceScreens.tsx:57,133,195`; `types.ts:39-53` | Проверить SE 375 / Android 360/320; при обрезке — `grid-cols-4` для размеров / меньший шрифт |
| 20 | Refresh/back браузера теряют весь прогресс (нет роутинга/persist по шагам) | **Medium** | `Flow.tsx:25-31` | Минимум — `sessionStorage` для `sel`+`step`; лучше — синхронизация step с search-параметром TanStack Router |
| 21 | Node-версия не зафиксирована (нет `engines`/`.nvmrc`), локально 24 vs target 22 | **Medium** | `package.json`; нет `.nvmrc` | Добавить `"engines":{"node":">=22 <23"}` и `.nvmrc=22`; для Docker `node:22-slim` |
| 22 | Nitro взят как nightly-сборка (риск воспроизводимости) | **Medium** | `package.json:85` (`nitro-nightly@3.0.1-2026...`) | Зафиксировать стабильный релиз и пересобрать; иначе явно запинить точную nightly и предупредить |
| 23 | npm audit: 16 уязвимостей (6 high), в основном dev-цепочка (vite/ws/esbuild/miniflare) | **Medium** | `npm audit`; `@cloudflare/vite-plugin` при `cloudflare:false` | `npm audit fix`; удалить неиспользуемый `@cloudflare/vite-plugin` (уберёт ws/miniflare/wrangler); проверить undici/ws в Nitro |
| 24 | Низкоконтрастный текст в Hero (`suede/60`, `suede/40`, мелкий кегль 0.55-0.62rem) | **Medium** | `Hero.tsx:187,294-296,324`; `ui.tsx:289` | Не опускать прозрачность ниже 4.5:1 для текста; кегли ≥12px или пометить декоративными |
| 25 | Часть продуктовых изображений с пустым `alt` при отсутствии `name` | **Medium** | `ProductCards.tsx:62`; `sneakers-api.ts:48` | Fallback `alt` («Кроссовки {brand}»); декоративные — явный `alt=""` |
| 26 | Свайп: конфликт с вертикальным скроллом, нет `overscroll-behavior` (pull-to-refresh) | **Medium** | `StyleDeck.tsx:28,60-83,123`; `ui.tsx:186` | Тестировать на реальном тач-устройстве; рассмотреть `overscroll-behavior:none` |
| 27 | Контактной формы с валидацией нет (заявлен RHF+zod) — только соц-ссылки | **Medium** | `Contacts.tsx:7-59`; RHF только в `ui/form.tsx` | Подтвердить с заказчиком, что лид через мессенджеры — намеренно; иначе добавить форму с zod-валидацией |
| 28 | Нет health-check эндпоинта для мониторинга/оркестрации | **Medium** | grep `health/livez/readyz` → пусто | Добавить `GET /api/health` (liveness, без upstream); опц. `/api/ready`; внешний uptime-монитор |
| 29 | Мусор/тяжёлые артефакты на диске (~330MB) — риск утечки в передачу | **Medium** | `du -sh`; `dist` 168M, `Shnurok MVP Visual` 101M, `.vercel` 32M | Передавать только через `git archive`/чистый clone; удалить локальные копии/dist/output/.vercel/.wrangler/frame.png |
| 30 | Нет CI и автоматизированной приёмки | **Medium** | нет `.github/workflows` | Минимальный CI (lint+tsc+build, опц. test) как часть передачи |
| 31 | robots/sitemap раскрывают старый Vercel-домен (+опечатка) | **Low** | `public/robots.txt`; `public/sitemap.xml` | Параметризовать домен, обновить перед передачей |
| 32 | `rel="noreferrer"` без `noopener` на результатах (несогласованно с Contacts) | **Low** | `ProductCards.tsx:135` vs `Contacts.tsx:49` | Унифицировать на `rel="noopener noreferrer"` |
| 33 | Hover-зависимые состояния на тач-устройствах (возможное «залипание») | **Low** | `ui.tsx:62`; `flow-utils.ts:21-26`; `ProductCards.tsx:136` | QA на реальном iPhone/Android: проверить отсутствие залипшего hover |
| 34 | Чипы фильтров `truncate` при нескольких выбранных значениях | **Low** | `FlowNav.tsx:160-171` | Проверить на 360-390px; допустить перенос или счётчик «+2» |
| 35 | Lovable-обёртка/dev-плагины и невостребованные shadcn-deps в передаче | **Low** | `vite.config.ts:7`; recharts/embla/vaul/cmdk — 0 использований | Документировать lovable-конфиг; опц. прогнать knip/depcheck, удалить лишнее; убрать `bunfig.toml` |
| 36 | ТЗ-файлы и docs/*.docx/*.pdf трекаются в git → уйдут заказчику | **Low** | `git ls-files`: `*-tz.md`, `docs/*.docx` | Решить с заказчиком: оставить как контекст или вынести в архив |
| 37 | RTO/rollback и регламент обновлений не определены | **Low** | нет runbook | Runbook: rollback = деплой предыдущего git-тега + рестарт; бэкап env/nginx/SSL; регламент `npm audit` |
| 38 | Утечка ошибок upstream — реализовано корректно (info) | **Info** | `sneakers.ts:88-98` | Оставить; добавить серверное логирование без тела/токена |
| 39 | PII/152-ФЗ — ПДн не собираются (info) | **Info** | `Contacts.tsx`; grep gtag/ym → пусто | При добавлении аналитики/формы — cookie-баннер, политика, расширение CSP |

---

## 1. Чек-лист: Безопасность

| Что проверяем | Как | Критерий (приоритет) |
|---|---|---|
| Security-заголовки на боевом self-host домене | `curl -sI https://<домен>/` и `/api/sneakers`; прогнать securityheaders.com и Mozilla Observatory | Все 6 заголовков на **каждом** ответе (вкл. 404/502); securityheaders.com ≥ A. Нет → `vercel.json` не перенесён, **блокер** (**P0**) |
| Токен не утекает в клиент | `grep -r 'SNEAKERS_API_TOKEN' dist/client .output/public`; `grep -rni 'Bearer\|Authorization' dist/client`; `grep -r 'sneakers.php' dist/client`; DevTools Network → запрос к `/api/sneakers` без `Authorization` | Пусто во всех grep; в браузере нет `Authorization` и upstream-URL (**P0**) |
| HTTPS, редирект http→https, TLS | `curl -sI http://<домен>/` (ждём 301/308); ssllabs.com/ssltest | http→https (301/308); SSL Labs ≥ A; TLS 1.2+; HSTS только при рабочем HTTPS (**P0**) |
| Обход rate-limit через подмену `X-Forwarded-For` | 40 POST с фиксированным `-H 'X-Forwarded-For: 1.2.3.4'`, затем меняя XFF на каждом запросе | Фикс. XFF: после ~30 → 429. Меняя XFF — если 429 не срабатывает никогда → Nginx доверяет клиентскому XFF, нужна перезапись на `$remote_addr` (**P1**) |
| Валидация ввода и лимит тела 4KB | POST с неверным типом+лишним полем; тело >4KB; невалидный JSON | Невалидный → 400; лишние поля молча отброшены (`.strip`); >4KB → 413; ошибки без stack/деталей upstream (**P1**) |
| Детали ошибки upstream не утекают | Указать `SNEAKERS_API_URL` на недоступный хост, `curl -i -X POST .../api/sneakers -d '{}'` | 502 «Sneakers API request failed» без stack/URL/токена; таймаут ~8s (**P1**) |
| `npm audit` перед передачей | `npm audit`; `npm audit --omit=dev`; `npm audit fix` | 0 high в прод-цепочке (`--omit=dev`); зафиксирован lockfile; решение по `@cloudflare/vite-plugin` задокументировано (**P1**) |
| Защита `href` товара от `javascript:`/`data:` | Замокать upstream с `detail_url='javascript:alert(1)'` или юнит-тест `normalizeProductUrl` | Схема не http/https отбрасывается, опасный href не рендерится. До фикса — задокументировать как принятый риск (**P2**) |
| Кликджекинг и CSP в браузере | Встроить сайт в `<iframe>`; DevTools Console при штатной работе | iframe блокируется (X-Frame-Options DENY / frame-ancestors); нет блокировок легитимных скриптов/шрифтов/картинок (**P2**) |
| Серверное логирование без PII/секретов | Проверить логи Nginx/процесс-менеджера; флуд POST 100 rps | В логах нет токена/Authorization/тела; при флуде срабатывает лимит, сервис не падает (**P2**) |

---

## 2. Чек-лист: Готовность кода и сборки

| Что проверяем | Как | Критерий (приоритет) |
|---|---|---|
| Чистая установка из lock-файла | `rm -rf node_modules && npm ci` (на Node 22) | Установка без ошибок резолва, lock не меняется. Падает на версии Node → нужен `engines`/`.nvmrc` (**P0**) |
| Прод-сборка проходит чисто | `npm run build`, проверить вывод vite (client+ssr+prerender) | Билд успешен (~2-3с), prerender главной OK. Без `VERCEL` НЕ создаётся серверный рантайм — см. след. пункт (**P0**) |
| Сборка под self-host даёт запускаемый Node-сервер | После переключения preset: проверить `.output/server/index.mjs`, затем `SNEAKERS_API_TOKEN=... PORT=3000 node .output/server/index.mjs`; `curl localhost:3000` + POST `/api/sneakers` | Сервер слушает PORT, отдаёт HTML, прокси возвращает JSON (или 502/500). **СЕЙЧАС НЕ ВЫПОЛНИМО — блокер** (**P0**) |
| Линтер зелёный | `npm run format` затем `npm run lint` | После format — 0 ошибок (сейчас 2 prettier + 6 warnings) (**P1**) |
| Тесты запускаются и проходят | Добавить `tsx` + `"test":"tsx --test 'src/**/*.test.{ts,tsx}'"`, `npm test`; актуализировать устаревший `responsive-layout.test.tsx` | Все 7 файлов прогоняются, pass. Сейчас раннера нет, `node --test` падает `ERR_MODULE_NOT_FOUND` (**P1**) |
| Воспроизводимость: версия Node | Проверить `engines`/`.nvmrc`; согласовать Node между dev/target/сервером | Зафиксирована одна мажорная версия Node 22 (**P1**) |
| Поведение фронта при пустом/сбойном ответе | По коду + ручной прогон с битым upstream | `fetchSneakers` → empty fallback, брендовый `EmptyState`, без выдуманных товаров (подтверждено, **P2**) |

---

## 3. Чек-лист: Развёртывание на сервере заказчика (self-host) + эксплуатация

| Что проверяем | Как | Критерий (приоритет) |
|---|---|---|
| Тестовый деплой на чистый VPS (node-server) | На чистой Ubuntu-VM: `git clone`, `npm ci`, env, build с preset `node-server`, `node .output/server/index.mjs`, пройти квиз до результатов | Поднимает HTTP-порт, SSR главной, POST `/api/sneakers` отдаёт реальную подборку (не fallback) (**P0**) |
| Security-заголовки после self-host деплоя | `curl -I https://<домен>` и `/api/sneakers`; securityheaders.com; проверить на 404/502 | Все 6 заголовков на всех ответах; ≥ A; CSP не блокирует self-host шрифты и upstream-картинки (**P0**) |
| Токен не в бандле/логах + не в архиве | `grep -rn 'SNEAKERS_API_TOKEN\|Bearer ' .output/public`; view-source + Network; проверить `.env` не в архиве | Токен отсутствует в клиентской статике и в архиве; `Authorization` только в запросе сервер→upstream (**P0**) |
| Доступность upstream с сервера заказчика + сбой | С прод-сервера: `curl -m 12 -X POST $SNEAKERS_API_URL -H 'Authorization: Bearer <token>' -d '{"limit":1}'`; затем сымитировать сбой | С токеном 200+валидный JSON, egress не блокирует; при сбое — 502 + fallback UI без крэша/утечки (**P0**) |
| SSL, редиректы, привязка домена | certbot + Nginx; `http→https` (301), www↔apex, `certbot renew --dry-run` | HTTPS валиден, редиректы 301, HSTS присутствует, автопродление dry-run проходит (**P1**) |
| Health-check и uptime-мониторинг | После добавления `/api/health`: `curl .../api/health`; навесить UptimeRobot/Healthchecks; `kill -9 PID` | `/api/health` → 200 без upstream; монитор зелёный; процесс-менеджер рестартует; алерт при падении (**P1**) |
| Нагрузочный smoke + rate-limit за Nginx | 50-100 POST/мин с одного IP (hey/ab); проверить `X-Real-IP`; `nmap`/`curl` на публичный IP:порт | После 30/мин → 429; разные IP лимитируются раздельно; порт приложения слушает только `127.0.0.1` (**P1**) |
| Секрет на сервере (env 600 + ротация) | `ls -la /etc/shnurok.env`; systemd `EnvironmentFile`; процедура ротации | Файл 600, владелец сервис-юзера, вне каталога проекта/образа; ротация = замена env + рестарт без редеплоя (**P1**) |
| Чистота передаваемого архива | `git archive`/свежий clone, сравнить с передаваемым | Только git-tracked файлы; нет `.env`/`dist`/`output`/`.vercel`/`.wrangler`/`Shnurok MVP Visual`/`frame.png`/`node_modules` (**P2**) |
| Замена доменных констант / SEO | grep `vercel.app`/`shnukor-landing`; canonical/og в исходнике; `/robots.txt`, `/sitemap.xml`; OG-валидатор | Нет ссылок на vercel.app; всё на домен заказчика; OG-превью рендерится (**P2**) |
| Сжатие и кэш статики | `curl -I -H 'Accept-Encoding: br,gzip'` на `/assets/*.js`, `/fonts/*.woff2` | `Content-Encoding` br/gzip + `Cache-Control: immutable` долгий; HTTP/2 (**P2**) |

---

## 4. Чек-лист: Адаптивность (мобайл/планшет)

> Примечание: `useIsMobile` в боевом UI не используется — вся адаптивность на CSS-брейкпоинтах Tailwind. Эмулятор DevTools не заменяет реальный тач для свайпа.

### Матрица устройств (портрет, если не указано)

| Класс | Ширины / пресеты |
|---|---|
| Минимум / узкие Android | 320, 360 |
| iPhone | 375 (SE/13 mini), 390 (14/15), 414, 430 (15 Pro Max) — выбрать пресет с notch (14 Pro) |
| Планшеты | iPad mini 768×1024, iPad Air 820×1180, iPad Pro 11 834×1194 — **портрет И ландшафт** |
| Ландшафт телефона | iPhone SE/14 повёрнутые (~667-932 × 375-430) |

| Что проверяем | Как | Критерий (приоритет) |
|---|---|---|
| Матрица ширин, портрет | DevTools Device Toolbar, пройти весь поток (hero→размер→цвет→цена→задача→спорт→свайп→поиск→результаты→empty) на всех ширинах | Нет горизонтального скролла; H1 переносятся без обрезки; размеры (`grid-cols-5`) и цвета (`grid-cols-4`) читаемы целиком; нижняя панель свайпа видна (**P0**) |
| Планшеты md/lg граница 768-1024 | iPad mini/Air/Pro в портрете и ландшафте; следить за `SelectionAside` (`hidden lg:flex`) и `ChoiceLayout` | Портрет 768/820: одноколоночно без больших пустот; ландшафт ≥1024: двухколоночно с боковой панелью; переход md↔lg без поломки (**P0**) |
| Свайп на **реальном** тач-устройстве | Физический iPhone (Safari) + Android (Chrome): свайп вправо/влево, ниже порога (возврат), флик, диагональ, у верх/ниж края | Карта тянется за пальцем, бейджи like/dislike, порог 110px улетает→следующая; вертикальный скролл не перехватывает; нет pull-to-refresh (**P0**) |
| Тап-таргеты ≥44px | DevTools computed size иконок контактов (сейчас 28-32px); реальный телефон — попасть по 3 иконкам подряд | Кликабельная зона ≥44×44; по трём иконкам уверенно без промахов (**P1**) |
| Safe-area / notch / home-indicator | Реальный iPhone X+ / Simulator: фикс-панель свайпа vs home-indicator, шапка vs notch в ландшафте | Кнопки не под индикатором; шапка не под вырезом; скрытие адресной строки не ломает контент (**P1**) |
| dvh/svh + фикс-элементы при скролле адресной строки | Скроллить экраны с `h-dvh`/`min-h-dvh`, скрывая/показывая адресную строку | Контент = видимой высоте, без отрезанной панели и скачков; внутренний `overflow-y-auto` скроллит только контент (**P1**) |
| Overflow длинных русских строк/чипов | На 360/375px выбрать максимум опций (3 цвета, размер, цена) | Названия цветов не обрезаются/не наезжают на swatch; чипы читаемы (не сплошное многоточие); H1 целиком (**P1**) |
| Ландшафт телефона (низкая высота) | Повернуть телефонные пресеты; экраны с `h-dvh`+`overflow-hidden` | Контент помещается или корректно скроллится; кнопки/боковая панель доступны (**P2**) |
| Скелетоны/ленивые изображения результатов | Шаги «поиск»/«результаты» на 360-430px при медленной сети | Сетка 2 кол. (mobile)/3 (sm) не ломается; `object-contain` не выходит за рамки; переход плейсхолдер→фото плавный (**P2**) |
| Hover-состояния на тач | Реальный iPhone/Android: тап по карточкам/кнопкам | Нет залипшего hover после тапа; active/aria-pressed читаются (**P2**) |

---

## 5. Чек-лист: UX/UI и доступность (a11y)

| Что проверяем | Как | Критерий (приоритет) |
|---|---|---|
| Состояние ошибки API | DevTools Network → Block `/api/sneakers` (или Offline/502/битый JSON), пройти до подбора | **БАГ сейчас:** показывается EmptyState. Должно: отдельный экран ошибки с «Повторить поиск», фильтры сохранены (**P0**) |
| Состояние empty (API вернул []) | Замокать пустой массив, пройти флоу | EmptyState с контактами и «Попробовать ещё раз», корректная микрокопия; отличается от ошибки (**P0**) |
| Клавиатурный проход всего флоу | Без мыши: Tab/Shift+Tab/Enter/Space через все шаги; дека — кнопками like/dislike | Все интерактивы достижимы, виден focus-visible, логичный порядок, дека проходима кнопками (**P0**) |
| Скринридер: шаги/загрузка/результаты | VoiceOver (Safari) / NVDA (Chrome), пройти флоу | **БАГ сейчас:** смена шага и завершение подбора не объявляются. Должно: анонс h1 нового шага + статус через aria-live (**P0**) |
| prefers-reduced-motion | macOS «Уменьшение движения» или DevTools Rendering → Emulate reduce | **БАГ сейчас:** Hero/Lottie/прогресс крутятся. Должно: анимации сведены к минимуму, Lottie без autoplay-loop (**P0**) |
| Refresh/back посреди флоу | Дойти до «Стиль», F5; системная «Назад»; восстановление вкладки | Сейчас полный сброс. Ожидаемо после фикса: восстановление step+sel (session/URL) (**P1**) |
| Контраст текста | axe DevTools + Lighthouse a11y; пипетка по `suede/60,40`, кеглям 0.55-0.62rem | ≥4.5:1 для текста <18.66px; ≥3:1 для крупного; полупрозрачные suede пометить декоративными или поднять контраст (**P1**) |
| axe/Lighthouse полный прогон каждого экрана | «Scan all of my page» + Lighthouse a11y на hero/size/color/price/task/sport/style/search/results/empty | 0 критичных: alt, имена кнопок, landmark, контраст (**P1**) |
| Edge cases данных | Замокать записи: name 120 симв. без пробелов; price=''/0; без img/url/битый img | Name `line-clamp-2` без разрыва; пустая цена → фоллбэк («Цена по запросу»); битая картинка → placeholder; нет url → «Ссылка скоро появится» (**P1**) |
| Landmark/heading структура | headingsMap / axe на шагах | Один осмысленный h1 на экран; контент шага желательно в `<main>` (сейчас только в Hero) (**P2**) |
| Двойной/быстрый ввод | Быстро жать like/dislike на последней карте и «Далее»; дёргать навигацию на подборе | Нет двойных переходов/двойных fetch; `swiping`-флаг/disabled блокируют повтор (**P2**) |
| `rel` на внешних ссылках | Проверить `ProductCards.tsx:135` vs `Contacts.tsx:49` | Унифицировать на `rel="noopener noreferrer"` (**P2**) |

---

## 6. Чек-лист: Performance / SEO / Юридическая готовность (152-ФЗ)

| Что проверяем | Как | Критерий (приоритет) |
|---|---|---|
| OG/мета/sitemap/robots после смены домена | view-source canonical/og:url/og:image; opengraph.xyz / Telegram-превью; `/robots.txt`, `/sitemap.xml` | Всё на домен заказчика, og-image 200, превью корректное; нет `shnukor-landing.vercel.app` и опечатки (**P1**) |
| Вес страницы/изображений на мобильной сети | DevTools Network throttling Fast/Slow 4G, Disable cache, перезагрузить hero; Lighthouse Mobile | Зафиксировать baseline: 3 hero-PNG (~2.2-2.6MB) + boots.json (263KB) — основной вес; после webp/lazy — падение transfer и LCP (**P1**) |
| Lighthouse Performance + сжатие/кэш | Lighthouse mobile+desktop на прод-домене; заголовки статики | Performance ≥ 85 (mobile); статика br/gzip + immutable-кэш; нет render-blocking/горизонтального скролла (**P2**) |
| Производительность анимаций hero/Lottie | DevTools Performance, CPU throttling 4-6x, 10с записи; реальный бюджетный Android | Hero плавно (≈60/30fps) без фризов; Lottie не блокирует поток надолго; reduced-motion учтён (**P2**) |
| 152-ФЗ / cookie / аналитика (текущее) | grep gtag/ym/metrika/cookie-consent → пусто; `Contacts.tsx` — только мессенджеры | ПДн не собираются, cookie/трекеров нет — требований 152-ФЗ на текущей функциональности не возникает (info) |
| 152-ФЗ при добавлении аналитики/формы | Если заказчик добавит Метрику/GA/форму ПДн | Потребуются cookie-баннер + согласие (отдельный чекбокс, не предустановлен), политика конфиденциальности, расширение CSP под домены аналитики, уведомление РКН, серверы в РФ; зафиксировать оператора ПДн в договоре (**P1** при добавлении) |

---

## Чек-лист самой передачи

- [ ] **Чистый репозиторий** через `git archive`/свежий `git clone` (не копирование папки). Проверить отсутствие `.env`, `dist/`, `output/`, `.vercel/`, `.wrangler/`, `node_modules`, локальных копий («Shnurok MVP Visual», «shnukor_landing 2», «шнурок»), `frame.png`.
- [ ] **`.env.example`** с пустыми значениями `SNEAKERS_API_URL`, `SNEAKERS_API_TOKEN` (реальный токен — отдельным защищённым каналом, **с ротацией** при передаче).
- [ ] **Документация деплоя `README_SELFHOST.md`**: build с preset `node-server` → запуск `.output/server/index.mjs` под pm2/systemd → пример `nginx.conf` (proxy_pass на `127.0.0.1:PORT`, security-заголовки, gzip/brotli, кэш статики, TLS) → env-переменные → опц. Dockerfile (multi-stage, `node:22-slim`).
- [ ] **Acceptance-критерии**: все P0 закрыты — self-host build поднимается, прокси отвечает, security-заголовки ≥ A на securityheaders.com, токен не в клиенте, домен заменён, error/empty-состояния различаются.
- [ ] **Контакты по upstream API**: владелец `shnurok-shipping.ru` и токена, ответственный за PHP-API, нужен ли whitelist исходящего IP сервера, SLA/режим обслуживания, процедура ротации токена.
- [ ] **Runbook эксплуатации**: rollback (деплой предыдущего git-тега + рестарт), бэкап `/etc/shnurok.env`/nginx/SSL, регламент `npm audit`/обновлений (особо — nightly Nitro, React 19).
- [ ] **Решение по ТЗ-файлам** (`*-tz.md`, `docs/*.docx/*.pdf`): оставить как контекст или вынести в архив.
- [ ] **Гарантийный период и SLA**: срок, часы реакции, кто чинит инциденты с лендингом vs с upstream.
- [ ] **Доступы**: DNS/регистратор, сервер, кто управляет certbot.

---

## Открытые вопросы к заказчику

1. **На каком сервере/ОС хостинг?** Голый Node VPS под systemd/pm2, Docker, Docker за Nginx, или shared hosting? От этого зависит, где закреплять security-заголовки (Nginx vs Nitro middleware), какие infra-артефакты готовить и какой Nitro preset фиксировать. **(Ключевой — определяет половину работ.)**
2. **Кто владеет upstream `shnurok-shipping.ru` (домен, сервер, PHP-API) и `SNEAKERS_API_TOKEN`?** Каталог (`detail_url`) на том же хосте — это инфраструктура заказчика? Кто отвечает за SLA? Нужен ли whitelist исходящего IP сервера на стороне PHP-API, и какой это IP после переезда (есть ли egress-ограничения)?
3. **Будет ли ротирован токен при передаче?** Текущий `.env` с реальным токеном лежит локально — без ротации прежний владелец сохранит доступ.
4. **Финальный домен лендинга?** Нужен для `SITE_URL`, `robots.txt`, `sitemap.xml`, SSL, CSP до передачи. Кто владеет доменом и управляет DNS/сертификатами (certbot) после передачи?
5. **Кто терминирует TLS** — Nginx у заказчика, Cloudflare, иное? Влияет на HSTS и обработку `X-Forwarded-For` (от него зависит per-IP rate-limit). Включать ли HSTS preload (необратим на время max-age)?
6. **Планируется ли аналитика (Яндекс.Метрика/GA) или форма сбора контактов с ПДн?** Если да — нужны cookie-согласие, политика конфиденциальности, обвязка по 152-ФЗ, расширение CSP, определение оператора ПДн. Сейчас лид идёт только через мессенджеры — это намеренно?
7. **Состояние ошибки API** — допустимо ли показывать пользователю явную ошибку с retry, или продукт намеренно прячет сбой за «ничего не найдено»?
8. **Нужен ли рабочий тест-раннер и CI?** 7 `*.test.*` сейчас нечем запускать, один устарел. Входит ли настройка в передачу или тесты декоративны?
9. **Можно ли заменить `nitro-nightly` на стабильный релиз** перед передачей, или есть зависимость от nightly-фич?
10. **Можно ли удалить `@cloudflare/vite-plugin`** (cloudflare:false не используется)? Это уберёт уязвимые ws/miniflare/wrangler из дерева.
11. **Целевой уровень accessibility** (WCAG 2.1 AA?) — нужно ли формально подтверждать соответствие axe/Lighthouse при приёмке?
12. **Объём и срок гарантийного периода/SLA** после передачи?
