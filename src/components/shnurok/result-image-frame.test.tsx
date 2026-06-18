/// <reference types="node" />

import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { SearchScreen } from "./FlowResultScreens";
import { ResultCard } from "./ProductCards";
import type { ProductItem } from "./data";
import type { Selections } from "./types";

const product: ProductItem = {
  brand: "Nike",
  name: "Test Sneaker",
  price: "10 000 ₽",
  size: "40",
  why: "Тестовое объяснение почему подходит.",
  img: "/test-sneaker.png",
  fit: "88% подходит",
  url: "https://shnurok-shipping.ru/catalog/test-sneaker/",
};

const selections: Selections = {
  sizes: ["EU 40"],
  colors: ["white"],
  price: "p3",
  task: "daily",
  styleVotes: {},
};

test("SearchScreen shows branded placeholders while product images are loading", () => {
  const html = renderToStaticMarkup(
    <SearchScreen sel={selections} onHome={() => {}} onDone={() => {}} />,
  );

  const placeholders = html.match(/data-slot="result-preview-placeholder"/g) ?? [];
  assert.equal(placeholders.length, 6);
  assert.match(html, /result-placeholder\.png/);
  assert.doesNotMatch(html, /animate-pulse/);
});

test("ResultCard fills the card with the product photo over a branded fallback", () => {
  const html = renderToStaticMarkup(<ResultCard item={product} />);

  // Branded backdrop is rendered (shown until the real photo finishes loading).
  assert.match(html, /result-placeholder\.png/);
  // The loaded photo is fully visible and centered — contained, never cropped.
  assert.match(html, /data-slot="result-product-image"[^>]*object-contain/);
  assert.doesNotMatch(html, /data-slot="result-product-image"[^>]*object-cover/);
});
