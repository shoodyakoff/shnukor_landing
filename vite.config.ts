// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Deploy targets:
//  - Vercel: the platform sets VERCEL=1 -> Vercel preset; HTTP headers come from
//    vercel.json.
//  - Self-hosting (Docker / a plain Node server): set NITRO_PRESET=node-server.
//    Nitro then builds a standalone server at `.output/server/index.mjs` that
//    listens on $PORT (default 3000) and also serves the prerendered assets.
//    Security headers travel with the app via routeRules below.
//  - Local dev / default build: neither env var set -> no Nitro plugin, behaves
//    exactly as before (TanStack Start's own dev server / `dist/server`).
const isVercel = Boolean(process.env.VERCEL);
const selfHostPreset = process.env.NITRO_PRESET; // e.g. "node-server"
const basePath = process.env.VITE_BASE_PATH || "/";

// Applied to every response by the self-hosted Node server. Mirrors vercel.json
// minus HSTS — Strict-Transport-Security must only be sent over HTTPS, so the
// reverse proxy that terminates TLS (see docker/nginx.conf) adds it instead.
// Google Fonts directives are dropped because fonts are self-hosted.
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; "),
};

function nitroPlugin() {
  if (isVercel) {
    return nitro({
      preset: "vercel",
      vercel: { functions: { runtime: "nodejs22.x" } },
    });
  }
  if (selfHostPreset) {
    return nitro({
      preset: selfHostPreset,
      routeRules: { "/**": { headers: SECURITY_HEADERS } },
    });
  }
  return null;
}

export default defineConfig({
  cloudflare: false,
  plugins: [nitroPlugin()].filter(Boolean),
  tanstackStart: {
    router: {
      basepath: basePath,
    },
    client: {
      base: `${basePath}_build`,
    },
    pages: [{ path: "/" }],
    prerender: {
      enabled: true,
      crawlLinks: true,
      failOnError: true,
    },
  },
  vite: {
    base: basePath,
  },
});
