import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_SNEAKERS_API_URL = "https://shnurok-shipping.ru/api/sneakers.php";

export const Route = createFileRoute("/api/sneakers")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: corsHeaders(),
        }),
      POST: async ({ request }) => {
        const token = process.env.SNEAKERS_API_TOKEN;
        const apiUrl = process.env.SNEAKERS_API_URL || DEFAULT_SNEAKERS_API_URL;

        if (!token) {
          return Response.json(
            { success: false, error: "SNEAKERS_API_TOKEN is not configured" },
            { status: 500, headers: corsHeaders() },
          );
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json(
            { success: false, error: "Invalid JSON body" },
            { status: 400, headers: corsHeaders() },
          );
        }

        try {
          const upstream = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorizationHeader(token),
            },
            body: JSON.stringify(payload),
          });

          const text = await upstream.text();
          return new Response(text, {
            status: upstream.status,
            headers: {
              ...corsHeaders(),
              "Content-Type": upstream.headers.get("Content-Type") || "application/json",
            },
          });
        } catch {
          return Response.json(
            { success: false, error: "Sneakers API request failed" },
            { status: 502, headers: corsHeaders() },
          );
        }
      },
    },
  },
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function authorizationHeader(token: string) {
  return token.trim().toLowerCase().startsWith("bearer ") ? token.trim() : `Bearer ${token.trim()}`;
}
