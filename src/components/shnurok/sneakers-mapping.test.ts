/// <reference types="node" />

import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { Route } from "../../routes/api/sneakers";
import { showPriceChipForStep } from "./flow-utils";
import { fetchSneakers } from "./sneakers-api";
import {
  buildSneakersPayload,
  getSneakersCardById,
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
      "daily-puffy": "dislike",
      "daily-running": "dislike",
      "daily-retro-runner": "dislike",
      "daily-tech": "dislike",
      "daily-luxury": "dislike",
    },
  };

  assert.equal(isAllSkipSelection(selections), true);
  assert.deepEqual(buildSneakersPayload(selections), {
    size: ["37"],
    categories: [349, 731, 730, 569, 576, 765, 493, 732, 579, 348],
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

test("taxonomy includes all daily visual folders and excludes unsupported sport cards", () => {
  const dailyCards = getSneakersCardsForSelections({
    sizes: [],
    colors: [],
    task: "daily",
    styleVotes: {},
  });

  assert.equal(SPORTS.includes("Универсальные для спорта"), false);
  assert.deepEqual(
    dailyCards.map((card) => card.categoryId),
    [349, 731, 730, 569, 576, 765, 493, 732, 579, 348],
  );
  assert.equal(
    dailyCards.some((card) => card.title.includes("Дутые")),
    true,
  );
});

test("selected sport cards use generated Tinder sport images", () => {
  assert.equal(
    getSneakersCardById("basketball-rubber")?.image,
    "/tinder-sport/basketball-rubber.webp",
  );
  assert.equal(getSneakersCardById("fitness-base")?.image, "/tinder-sport/fitness-base.webp");
  assert.equal(
    getSneakersCardById("fitness-weightlifting")?.image,
    "/tinder-sport/fitness-weightlifting.webp",
  );
  assert.equal(
    getSneakersCardById("fitness-functional")?.image,
    "/tinder-sport/fitness-functional.webp",
  );
  assert.equal(
    getSneakersCardById("fitness-crossfit")?.image,
    "/tinder-sport/fitness-crossfit.webp",
  );
  assert.equal(getSneakersCardById("fitness-group")?.image, "/tinder-sport/fitness-group.webp");
  assert.equal(
    getSneakersCardById("football-artificial")?.image,
    "/tinder-sport/football-artificial.webp",
  );
  assert.equal(
    getSneakersCardById("football-natural")?.image,
    "/tinder-sport/football-natural.webp",
  );
  assert.equal(getSneakersCardById("football-base")?.image, "/tinder-sport/football-base.webp");
  assert.equal(getSneakersCardById("football-futsal")?.image, "/tinder-sport/football-futsal.webp");
  assert.equal(getSneakersCardById("run-street")?.image, "/tinder-sport/run-street.webp");
  assert.equal(getSneakersCardById("run-long")?.image, "/tinder-sport/run-long.webp");
  assert.equal(getSneakersCardById("run-trail")?.image, "/tinder-sport/run-trail.webp");
  assert.equal(getSneakersCardById("run-urban-trail")?.image, "/tinder-sport/run-urban-trail.webp");
  assert.equal(getSneakersCardById("tennis-clay")?.image, "/tinder-sport/tennis-clay.webp");
  assert.equal(getSneakersCardById("run-track")?.image, "/tinder-sport/run-track.webp");
  assert.equal(getSneakersCardById("run-winter")?.image, "/tinder-sport/run-winter.webp");
  assert.equal(getSneakersCardById("basketball-base")?.image, "/tinder-sport/basketball-base.webp");
  assert.equal(
    getSneakersCardById("basketball-street")?.image,
    "/tinder-sport/basketball-street.webp",
  );
  assert.equal(
    getSneakersCardById("basketball-rubber")?.image,
    "/tinder-sport/basketball-rubber.webp",
  );
  assert.equal(
    getSneakersCardById("basketball-parquet")?.image,
    "/tinder-sport/basketball-parquet.webp",
  );
  assert.equal(getSneakersCardById("tennis-hard")?.image, "/tinder-sport/tennis-hard.webp");
  assert.equal(getSneakersCardById("outdoor-trail")?.image, "/tinder-sport/outdoor-trail.webp");
  assert.equal(getSneakersCardById("outdoor-hiking")?.image, "/tinder-sport/outdoor-hiking.webp");
  assert.equal(
    getSneakersCardById("outdoor-trekking")?.image,
    "/tinder-sport/outdoor-trekking.webp",
  );
  assert.equal(getSneakersCardById("tennis-grass")?.image, "/tinder-sport/tennis-grass.webp");
  assert.equal(
    getSneakersCardById("tennis-universal")?.image,
    "/tinder-sport/tennis-universal.webp",
  );
  assert.equal(getSneakersCardById("tennis-padel")?.image, "/tinder-sport/tennis-padel.webp");
  assert.equal(getSneakersCardById("skate-base")?.image, "/tinder-sport/skate-base.webp");
  assert.equal(getSneakersCardById("skate-slipons")?.image, "/tinder-sport/skate-slipons.webp");
  assert.equal(getSneakersCardById("skate-low")?.image, "/tinder-sport/skate-low.webp");
  assert.equal(getSneakersCardById("skate-high")?.image, "/tinder-sport/skate-high.webp");
  assert.equal(getSneakersCardById("skate-cupsole")?.image, "/tinder-sport/skate-cupsole.webp");
});

test("showPriceChipForStep hides default price before the price step", () => {
  assert.equal(showPriceChipForStep("size"), false);
  assert.equal(showPriceChipForStep("color"), false);
  assert.equal(showPriceChipForStep("price"), true);
  assert.equal(showPriceChipForStep("task"), true);
  assert.equal(showPriceChipForStep("style"), true);
  assert.equal(showPriceChipForStep("search"), true);
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
