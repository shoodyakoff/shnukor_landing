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
    categoryId: 569,
  },
  {
    id: "daily-minimal",
    title: "Минималистичные кроссовки",
    desc: "Чистые пары без лишнего визуального шума.",
    image: "/tinder-daily/daily-minimal.webp",
    categoryId: 576,
  },
];

test("StepShell pins primary actions in a bottom bar (sticky on phones, in-flow on desktop)", () => {
  const html = renderToStaticMarkup(
    <StepShell
      eyebrow={<div>eyebrow</div>}
      title="Проверка адаптива"
      actions={<BigButton>Далее</BigButton>}
    >
      <div>content</div>
    </StepShell>,
  );

  assert.match(html, /sticky/);
  assert.match(html, /md:static/);
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
  assert.match(html, /pb-20/);
  assert.match(html, /h-\[clamp\(260px,48svh,430px\)\]/);
});
