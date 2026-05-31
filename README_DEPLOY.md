# Deploy to Vercel

This project needs a server runtime because `/api/sneakers` proxies requests to
`https://shnurok-shipping.ru/api/sneakers.php` and injects the private API token.
Do not deploy the live API version as a static GitHub Pages site.

## Vercel setup

1. Import the GitHub repository into Vercel.
2. Use the project defaults from `vercel.json`:
   - Install command: `npm install`
   - Build command: `npm run build`
3. Add environment variables in Vercel:
   - `SNEAKERS_API_URL=https://shnurok-shipping.ru/api/sneakers.php`
   - `SNEAKERS_API_TOKEN=<token>`
4. Deploy.

The Vercel build uses Nitro with the `vercel` preset and outputs
`.vercel/output`. On Vercel, the app is served from `/`, so the local
GitHub Pages base path is disabled automatically via `process.env.VERCEL`.

## Local run

Create `.env` from `.env.example`, fill `SNEAKERS_API_TOKEN`, then run:

```bash
npm install
npm run dev
```

Local dev keeps the `/shnukor_landing/` base path unless `VITE_BASE_PATH` is set.

## Sneakers API contract

Known request fields: `size`, `color`, `categories`, `price_from`, `price_to`, `limit`, `offset`.
The app sends category IDs as numbers, color names as lowercase Russian strings, and defaults
`limit` to `20` with `offset: 0` so the upstream API can return proportional results.
`SNEAKERS_API_TOKEN` may be stored either with or without the `Bearer ` prefix.

Known response fields: `id`, `offer_id`, `name`, `price`, `currency`, `size`, `image`,
`detail_url`.

The API does not currently return a product description. UI-to-API assumptions live in
`src/components/shnurok/sneakers-mapping.ts`; update that file when the category, color,
task, or style tables are clarified.
