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
    image: "/tinder-daily/daily-trending.png",
    categoryId: 569,
  },
  {
    id: "daily-minimal",
    title: "Минималистичные кроссовки",
    desc: "Чистые пары без лишнего визуального шума.",
    image: "/tinder-daily/daily-minimal.png",
    categoryId: 576,
  },
];

test("StepShell keeps action controls in normal flow until wide desktop", () => {
  const html = renderToStaticMarkup(
    <StepShell
      eyebrow={<div>eyebrow</div>}
      title="Проверка адаптива"
      actions={<BigButton>Далее</BigButton>}
    >
      <div>content</div>
    </StepShell>,
  );

  assert.match(html, /xl:absolute/);
  assert.match(html, /xl:pr-\[430px\]/);
  assert.doesNotMatch(html, /lg:absolute/);
  assert.doesNotMatch(html, /lg:pr-\[430px\]/);
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
      total={cards.length}
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
