/// <reference types="node" />

import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { StyleDeck } from "./StyleDeck";
import { BigButton, StepShell } from "./ui";
import type { SneakersCard } from "./sneakers-mapping";

const cards: SneakersCard[] = [
  {
    id: "daily-trending",
    title: "Трендовые кроссовки",
    desc: "Свежие силуэты на стыке баскетбола, бега, хайкинга и ретро.",
    image: "/tinder-daily/daily-trending.webp",
    bg: "#ccff00",
    fg: "#111",
    categoryId: 569,
    scenario: "daily",
  },
  {
    id: "daily-minimal",
    title: "Минималистичные кроссовки",
    desc: "Чистые пары без лишнего визуального шума.",
    image: "/tinder-daily/daily-minimal.webp",
    bg: "#b0ddff",
    fg: "#111",
    categoryId: 576,
    scenario: "daily",
  },
];

test("StepShell pins primary actions in a bottom bar (divider on phones, in-flow on desktop)", () => {
  const html = renderToStaticMarkup(
    <StepShell
      eyebrow={<div>eyebrow</div>}
      title="Проверка адаптива"
      actions={<BigButton>Далее</BigButton>}
    >
      <div>content</div>
    </StepShell>,
  );

  // The shell is locked to the viewport (h-dvh + overflow-hidden) so the action
  // bar sits in-flow at the bottom — separated by a divider on phones, plain on desktop.
  assert.match(html, /border-t-2/);
  assert.match(html, /md:border-0/);
  assert.doesNotMatch(html, /xl:absolute/);
  assert.doesNotMatch(html, /xl:pr-\[430px\]/);
});

test("Primary actions stretch on phones and return to intrinsic width on larger screens", () => {
  const html = renderToStaticMarkup(<BigButton>Далее</BigButton>);

  assert.match(html, /w-full/);
  assert.match(html, /sm:w-auto/);
});

test("StyleDeck pins the compact mobile action row and restores desktop side controls", () => {
  const html = renderToStaticMarkup(
    <StyleDeck
      upcoming={cards}
      cards={cards}
      currentIndex={0}
      onDislike={() => {}}
      onLike={() => {}}
    />,
  );

  assert.match(html, /grid-cols-2/);
  assert.match(html, /fixed/);
  assert.match(html, /lg:contents/);
  // Wrapper clears the fixed mobile action bar; the card area is a square so the
  // square product photos fill it edge-to-edge with no crop and no letterbox.
  assert.match(html, /pb-16/);
  assert.match(html, /aspect-square/);
});
