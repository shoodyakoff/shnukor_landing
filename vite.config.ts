// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Prod target is Vercel (served from "/"). VITE_BASE_PATH stays available for
// hosting under a sub-path (e.g. a future self-hosted VPS deploy).
const isVercel = Boolean(process.env.VERCEL);
const basePath = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  cloudflare: false,
  plugins: isVercel
    ? [
        nitro({
          preset: "vercel",
          vercel: {
            functions: {
              runtime: "nodejs22.x",
            },
          },
        }),
      ]
    : [],
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
