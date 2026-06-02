/// <reference types="node" />

import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { StyleDeck } from "./StyleDeck";
import type { SneakersCard } from "./sneakers-mapping";

const cards: SneakersCard[] = [
  {
    id: "daily-trending",
    title: "Трендовые кроссовки",
    desc: "Свежие силуэты на стыке баскетбола, бега, хайкинга и ретро.",
    image: "/tinder-daily/daily-trending.png",
    categoryId: "569",
  },
  {
    id: "daily-minimal",
    title: "Минималистичные кроссовки",
    desc: "Чистые пары без лишнего визуального шума.",
    image: "/tinder-daily/daily-minimal.png",
    categoryId: "570",
  },
];

test("StyleDeck keeps style copy above the image without darkening the artwork", () => {
  const html = renderToStaticMarkup(
    <StyleDeck
      upcoming={cards}
      cards={cards}
      currentIndex={0}
      total={cards.length}
      onDislike={() => {}}
      onLike={() => {}}
    />,
  );

  assert.ok(
    html.indexOf("стиль 1 из 2") < html.indexOf("<img"),
    "style counter should render before the image instead of inside a bottom overlay",
  );
  assert.ok(
    html.indexOf("Трендовые кроссовки") < html.indexOf("<img"),
    "style title should render before the image instead of covering it",
  );
  assert.doesNotMatch(html, /linear-gradient\(180deg/);
  assert.doesNotMatch(html, /backdrop-blur/);
});
