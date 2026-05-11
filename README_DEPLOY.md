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
