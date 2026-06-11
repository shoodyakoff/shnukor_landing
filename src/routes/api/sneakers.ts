import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const DEFAULT_SNEAKERS_API_URL = "https://shnurok-shipping.ru/api/sneakers.php";

// Hardening limits for the public proxy. The frontend calls this endpoint
// same-origin, so we intentionally do NOT send permissive CORS headers — that
// keeps the token-backed upstream from being abused by third-party sites.
const MAX_BODY_BYTES = 4 * 1024;
const UPSTREAM_TIMEOUT_MS = 8_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

// Whitelist of upstream request fields (see README_DEPLOY.md). Unknown keys are
// stripped so callers cannot smuggle arbitrary parameters to the upstream API.
const PayloadSchema = z
  .object({
    size: z.array(z.string().max(8)).max(10).optional(),
    color: z.array(z.string().max(40)).max(20).optional(),
    categories: z.array(z.number().int().nonnegative()).max(50).optional(),
    price_from: z.number().nonnegative().optional(),
    price_to: z.number().nonnegative().optional(),
    limit: z.number().int().positive().max(50).optional(),
    offset: z.number().int().nonnegative().max(10_000).optional(),
  })
  .strip();

export const Route = createFileRoute("/api/sneakers")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env.SNEAKERS_API_TOKEN;
        const apiUrl = process.env.SNEAKERS_API_URL || DEFAULT_SNEAKERS_API_URL;

        if (!token) {
          return jsonError("SNEAKERS_API_TOKEN is not configured", 500);
        }

        if (!allowRequest(clientIp(request))) {
          return jsonError("Too many requests", 429);
        }

        const declaredLength = Number(request.headers.get("content-length") || "0");
        if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
          return jsonError("Request body too large", 413);
        }

        let rawBody: string;
        try {
          rawBody = await request.text();
        } catch {
          return jsonError("Unable to read request body", 400);
        }
        if (rawBody.length > MAX_BODY_BYTES) {
          return jsonError("Request body too large", 413);
        }

        let parsed: unknown;
        try {
          parsed = rawBody ? JSON.parse(rawBody) : {};
        } catch {
          return jsonError("Invalid JSON body", 400);
        }

        const validated = PayloadSchema.safeParse(parsed);
        if (!validated.success) {
          return jsonError("Invalid request payload", 400);
        }

        try {
          const upstream = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorizationHeader(token),
            },
            body: JSON.stringify(validated.data),
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
          });

          const text = await upstream.text();
          return new Response(text, {
            status: upstream.status,
            headers: {
              "Content-Type": upstream.headers.get("Content-Type") || "application/json",
            },
          });
        } catch {
          return jsonError("Sneakers API request failed", 502);
        }
      },
    },
  },
});

function jsonError(error: string, status: number) {
  return Response.json({ success: false, error }, { status });
}

function authorizationHeader(token: string) {
  return token.trim().toLowerCase().startsWith("bearer ") ? token.trim() : `Bearer ${token.trim()}`;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

// Best-effort per-IP rate limit. On serverless platforms this is per-instance
// (memory is not shared across cold starts/instances), so it raises the bar for
// casual abuse rather than being a hard guarantee — pair with platform/WAF
// limits for production-grade protection.
const rateLimitHits = new Map<string, { count: number; resetAt: number }>();

function allowRequest(ip: string) {
  const now = Date.now();
  const entry = rateLimitHits.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    sweepRateLimit(now);
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function sweepRateLimit(now: number) {
  if (rateLimitHits.size < 1000) return;
  for (const [ip, entry] of rateLimitHits) {
    if (now > entry.resetAt) rateLimitHits.delete(ip);
  }
}
