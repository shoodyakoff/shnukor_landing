# syntax=docker/dockerfile:1

# ---- Build stage: install deps and produce the Nitro node-server bundle ----
FROM node:22-bookworm-slim AS build
WORKDIR /app

# Install dependencies from the lockfile first for better layer caching.
# Pin npm to the version declared in package.json ("packageManager") — the
# lockfile is resolved by npm 11 and `npm ci` on the image's default npm 10.x
# would reject it as out of sync.
COPY package.json package-lock.json ./
RUN npm install -g npm@11.11.0 && npm ci

# Copy the rest of the source (node_modules/.env/etc. excluded via .dockerignore).
COPY . .

# Public site origin baked into SSR meta tags + robots.txt + sitemap.xml.
# Pass with: --build-arg VITE_SITE_URL=https://your-domain.ru
# Leave empty to keep the built-in default origin.
ARG VITE_SITE_URL=""
RUN if [ -n "$VITE_SITE_URL" ]; then \
      origin=$(printf '%s' "$VITE_SITE_URL" | sed 's:/*$::'); \
      sed -i "s|https://shnukor-landing.vercel.app|$origin|g" \
        public/robots.txt public/sitemap.xml; \
    fi

# Build the standalone Node server -> .output/server/index.mjs + .output/public.
# NITRO_PRESET switches vite.config.ts onto the node-server preset.
ENV NITRO_PRESET=node-server
ENV VITE_SITE_URL=$VITE_SITE_URL
RUN npm run build

# ---- Runtime stage: ship only the build output (no node_modules / source) ----
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Nitro inlines its runtime dependencies, so only .output is needed to run.
COPY --from=build /app/.output ./.output

# Run as the unprivileged user that ships with the node image.
USER node

EXPOSE 3000

# Liveness probe (Node 22 ships a global fetch()). Hits the dependency-free
# /api/health route, so it reports the process, not the upstream catalog.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
