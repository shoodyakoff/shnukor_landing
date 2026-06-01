/// <reference types="node" />

import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { Route } from "../../routes/api/sneakers";
import { fetchSneakers } from "./sneakers-api";
import {
  buildSneakersPayload,
  getSneakersCardsForSelections,
  isAllSkipSelection,
  selectionsFromSneakersPayload,
} from "./sneakers-mapping";
import { SPORTS, type Selections } from "./types";

type SneakersPostHandler = (context: { request: Request }) => Promise<Response>;

const originalFetch = globalThis.fetch;
const originalToken = process.env.SNEAKERS_API_TOKEN;
const originalApiUrl = process.env.SNEAKERS_API_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  restoreEnv("SNEAKERS_API_TOKEN", originalToken);
  restoreEnv("SNEAKERS_API_URL", originalApiUrl);
});

test("buildSneakersPayload sends only liked daily cards when at least one card is liked", () => {
  const selections: Selections = {
    sizes: ["EU 36", "EU 37"],
    colors: ["grey", "blue"],
    price: "p4",
    task: "daily",
    styleVotes: {
      "daily-chunky": "like",
      "daily-retro-low": "dislike",
      "daily-retro-basket": "dislike",
      "daily-trending": "dislike",
      "daily-minimal": "like",
    },
  };

  assert.deepEqual(buildSneakersPayload(selections), {
    size: ["36", "37"],
    categories: [349, 576],
    color: ["серый", "серебристый", "синий", "бирюзовый"],
    price_from: 15000,
    price_to: 20000,
    limit: 20,
    offset: 0,
  });
});

test("buildSneakersPayload falls back to all daily cards on all-skip", () => {
  const selections: Selections = {
    sizes: ["EU 37"],
    colors: ["black"],
    price: "p3",
    task: "daily",
    styleVotes: {
      "daily-chunky": "dislike",
      "daily-retro-low": "dislike",
      "daily-retro-basket": "dislike",
      "daily-trending": "dislike",
      "daily-minimal": "dislike",
    },
  };

  assert.equal(isAllSkipSelection(selections), true);
  assert.deepEqual(buildSneakersPayload(selections), {
    size: ["37"],
    categories: [349, 731, 730, 569, 576],
    color: ["черный"],
    price_from: 10000,
    price_to: 15000,
    limit: 20,
    offset: 0,
  });
});

test("buildSneakersPayload uses selected sport cards and sport fallback cards", () => {
  const likedSelections: Selections = {
    sizes: [],
    colors: ["any"],
    price: "any",
    task: "sport",
    sport: "Бег",
    styleVotes: {
      "run-street": "dislike",
      "run-long": "like",
      "run-trail": "dislike",
      "run-urban-trail": "dislike",
      "run-track": "dislike",
      "run-winter": "like",
    },
  };
  const skippedSelections: Selections = {
    ...likedSelections,
    styleVotes: {
      "run-street": "dislike",
      "run-long": "dislike",
      "run-trail": "dislike",
      "run-urban-trail": "dislike",
      "run-track": "dislike",
      "run-winter": "dislike",
    },
  };

  assert.deepEqual(
    getSneakersCardsForSelections(likedSelections).map((card) => card.categoryId),
    [739, 740, 741, 742, 743, 744],
  );
  assert.deepEqual(buildSneakersPayload(likedSelections), {
    categories: [740, 744],
    limit: 20,
    offset: 0,
  });
  assert.equal(isAllSkipSelection(skippedSelections), true);
  assert.deepEqual(buildSneakersPayload(skippedSelections), {
    categories: [739, 740, 741, 742, 743, 744],
    limit: 20,
    offset: 0,
  });
});

test("buildSneakersPayload omits price limits for any and upper limit for p6", () => {
  const baseSelections: Selections = {
    sizes: [],
    colors: ["any"],
    task: "daily",
    styleVotes: { "daily-chunky": "like" },
  };

  assert.deepEqual(buildSneakersPayload({ ...baseSelections, price: "any" }), {
    categories: [349],
    limit: 20,
    offset: 0,
  });
  assert.deepEqual(buildSneakersPayload({ ...baseSelections, price: "p6" }), {
    categories: [349],
    price_from: 30000,
    limit: 20,
    offset: 0,
  });
});

test("taxonomy excludes unsupported sport and daily cards", () => {
  const dailyCards = getSneakersCardsForSelections({
    sizes: [],
    colors: [],
    task: "daily",
    styleVotes: {},
  });

  assert.equal(SPORTS.includes("Универсальные для спорта"), false);
  assert.deepEqual(
    dailyCards.map((card) => card.categoryId),
    [349, 731, 730, 569, 576],
  );
  assert.equal(
    dailyCards.some((card) => card.title.includes("Дутые")),
    false,
  );
});

test("selectionsFromSneakersPayload reads numeric categories from manual API payloads", () => {
  const selections = selectionsFromSneakersPayload({
    size: ["36"],
    categories: [739],
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

test("fetchSneakers dedupes products and normalizes Shnurok product links", async () => {
  const selections: Selections = {
    sizes: ["EU 36"],
    colors: ["any"],
    price: "any",
    task: "daily",
    styleVotes: { "daily-chunky": "like" },
  };
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        items: [
          {
            id: "a",
            name: "Nike Test A",
            price: 10000,
            size: "36",
            detail_url: "/catalog/obuv/nike-test-a/",
          },
          {
            id: "b",
            name: "Nike Test A Duplicate",
            price: 10000,
            size: "36",
            detail_url: "https://shnurok-shipping.ru/catalog/obuv/nike-test-a/",
          },
          {
            id: "c",
            name: "Nike Test B",
            price: 12000,
            size: "36",
            detail_url: "/catalog/obuv/nike-test-b/",
          },
        ],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );

  const result = await fetchSneakers(selections);

  assert.equal(result.source, "api");
  assert.equal(result.items.length, 2);
  assert.equal(result.items[0]?.url, "https://shnurok-shipping.ru/catalog/obuv/nike-test-a/");
  assert.equal(result.items[1]?.url, "https://shnurok-shipping.ru/catalog/obuv/nike-test-b/");
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
