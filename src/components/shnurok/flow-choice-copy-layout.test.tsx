/// <reference types="node" />

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ColorScreen, PriceScreen, SizeScreen, TaskScreen } from "./FlowChoiceScreens";
import { LogoMark } from "./FlowNav";
import type { Selections } from "./types";

const selections: Selections = {
  sizes: ["EU 42"],
  colors: ["white"],
  price: "p3",
  styleVotes: {},
};

test("LogoMark can act as a home control", () => {
  const html = renderToStaticMarkup(<LogoMark onClick={() => {}} />);

  assert.match(html, /<button type="button"/);
  assert.match(html, /aria-label="На главную"/);
  assert.match(html, /SHNUROK/);
});

test("Size step uses the polite title and desktop CTA in the title row", () => {
  const html = renderToStaticMarkup(
    <SizeScreen
      eyebrow={<div>header</div>}
      selections={selections}
      onNext={() => {}}
      onToggle={() => {}}
    />,
  );

  assert.match(html, /Какой у вас размер\?/);
  assert.match(html, /если носите разные бренды/);
  assert.match(html, /data-slot="step-title-action"/);
  assert.doesNotMatch(html, /Какой у тебя размер\?/);
  assert.doesNotMatch(html, /mt-4 hidden lg:flex/);
});

test("Color and price steps also place desktop CTA in the title row", () => {
  const colorHtml = renderToStaticMarkup(
    <ColorScreen
      eyebrow={<div>header</div>}
      selections={selections}
      onNext={() => {}}
      onToggle={() => {}}
    />,
  );
  const priceHtml = renderToStaticMarkup(
    <PriceScreen
      eyebrow={<div>header</div>}
      selections={selections}
      onNext={() => {}}
      onSelect={() => {}}
    />,
  );

  assert.match(colorHtml, /data-slot="step-title-action"/);
  assert.match(priceHtml, /data-slot="step-title-action"/);
  assert.doesNotMatch(colorHtml, /mt-4 hidden lg:flex/);
  assert.doesNotMatch(priceHtml, /mt-4 hidden lg:flex/);
});

test("Task step uses generated one-sneaker preview assets", () => {
  const html = renderToStaticMarkup(<TaskScreen eyebrow={<div>header</div>} onSelect={() => {}} />);

  assert.match(html, /task-preview\/task-daily.webp/);
  assert.match(html, /task-preview\/task-sport.webp/);
  assert.doesNotMatch(html, /catalog-court-minimal.webp/);
  assert.doesNotMatch(html, /catalog-knit-tech.webp/);
  assert.equal(existsSync("public/task-preview/task-daily.webp"), true);
  assert.equal(existsSync("public/task-preview/task-sport.webp"), true);
});

test("Price aside keeps the model name framed and wrapped", () => {
  const html = renderToStaticMarkup(
    <PriceScreen
      eyebrow={<div>header</div>}
      selections={selections}
      onNext={() => {}}
      onSelect={() => {}}
    />,
  );

  assert.match(html, /Топовая пара в этом сегменте/);
  assert.match(html, /line-clamp-2/);
  assert.match(html, /data-slot="price-preview-meta"/);
});
