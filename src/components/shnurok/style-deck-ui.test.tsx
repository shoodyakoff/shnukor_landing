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

test("StyleDeck overlays style copy on the card and drops the duplicated counter", () => {
  const html = renderToStaticMarkup(
    <StyleDeck
      upcoming={cards}
      cards={cards}
      currentIndex={0}
      onDislike={() => {}}
      onLike={() => {}}
    />,
  );

  // Title/desc now live in a gradient overlay on the artwork, not in a block above it.
  assert.match(html, /bg-gradient-to-t/);
  // The redundant "стиль N из M" pill is removed — the header progress bar owns progress.
  assert.doesNotMatch(html, /стиль 1 из 2/);
  // Card image must not hijack the pointer drag (native image DnD disabled).
  assert.match(html, /draggable="false"/);
  // Swipe actions are present.
  assert.match(html, /Нравится/);
  assert.match(html, /Не нравится/);
});
