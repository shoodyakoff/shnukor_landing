/// <reference types="node" />

import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { Route } from "../../routes/api/sneakers";
import { buildSneakersPayload, selectionsFromSneakersPayload } from "./sneakers-mapping";
import type { Selections } from "./types";

type SneakersPostHandler = (context: { request: Request }) => Promise<Response>;

const originalFetch = globalThis.fetch;
const originalToken = process.env.SNEAKERS_API_TOKEN;
const originalApiUrl = process.env.SNEAKERS_API_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  restoreEnv("SNEAKERS_API_TOKEN", originalToken);
  restoreEnv("SNEAKERS_API_URL", originalApiUrl);
});

test("buildSneakersPayload sends the updated proportional API contract", () => {
  const selections: Selections = {
    sizes: ["EU 36", "EU 37"],
    colors: ["black", "white"],
    price: "p4",
    task: "sport",
    sport: "Бег",
    styleVotes: {},
  };

  assert.deepEqual(buildSneakersPayload(selections), {
    size: ["36", "37"],
    categories: [493],
    color: ["черный", "белый"],
    price_from: 15000,
    price_to: 20000,
    limit: 20,
    offset: 0,
  });
});

test("selectionsFromSneakersPayload reads numeric categories from manual API payloads", () => {
  const selections = selectionsFromSneakersPayload({
    size: ["36"],
    categories: [493],
    color: ["черный"],
    price_from: 5000,
    price_to: 10000,
    limit: 20,
    offset: 0,
  });

  assert.deepEqual(selections.sizes, ["EU 36"]);
  assert.deepEqual(selections.colors, ["black"]);
  assert.equal(selections.price, "p2");
  assert.equal(selections.task, "sport");
  assert.equal(selections.sport, "Бег");
});

test("sneakers API proxy prefixes a bare env token with Bearer", async () => {
  let authorization = "";
  process.env.SNEAKERS_API_TOKEN = "test-token";
  process.env.SNEAKERS_API_URL = "https://example.test/sneakers";
  globalThis.fetch = async (_input, init) => {
    authorization = new Headers(init?.headers).get("Authorization") || "";
    return new Response("[]", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const post = (Route.options.server?.handlers as { POST?: SneakersPostHandler } | undefined)?.POST;
  if (!post) {
    throw new Error("Sneakers POST handler is not available.");
  }
  const response = await post({
    request: new Request("http://localhost/api/sneakers", {
      method: "POST",
      body: "{}",
    }),
  });

  assert.equal(response.status, 200);
  assert.equal(authorization, "Bearer test-token");
});

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}
