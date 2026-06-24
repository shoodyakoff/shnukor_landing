import { createFileRoute } from "@tanstack/react-router";

// Lightweight liveness probe for container HEALTHCHECK / uptime monitoring.
// Intentionally does NOT touch the upstream sneakers API — it answers whether
// this process is up, not whether the catalog is reachable.
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(
          { status: "ok", uptime: Math.round(process.uptime()) },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
