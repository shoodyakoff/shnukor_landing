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
    image: "/tinder-daily/daily-trending.webp",
    categoryId: "569",
  },
  {
    id: "daily-minimal",
    title: "Минималистичные кроссовки",
    desc: "Чистые пары без лишнего визуального шума.",
    image: "/tinder-daily/daily-minimal.webp",
    categoryId: "570",
  },
];

test("StyleDeck overlays the style title and a position counter on the card", () => {
  const html = renderToStaticMarkup(
    <StyleDeck
      upcoming={cards}
      cards={cards}
      currentIndex={0}
      onDislike={() => {}}
      onLike={() => {}}
    />,
  );

  // The style title is overlaid on the artwork (top of the card), not in a block above it.
  assert.match(html, /absolute inset-x-3 top-3/);
  assert.match(html, /Трендовые кроссовки/);
  // A compact "N / M" position counter rides on the top card, not the verbose
  // "стиль N из M" pill the deck used to render.
  assert.match(html, /1 \/ 2/);
  assert.doesNotMatch(html, /стиль 1 из 2/);
  // Card image must not hijack the pointer drag (native image DnD disabled).
  assert.match(html, /draggable="false"/);
  // Swipe actions are present.
  assert.match(html, /Нравится/);
  assert.match(html, /Не нравится/);
});
