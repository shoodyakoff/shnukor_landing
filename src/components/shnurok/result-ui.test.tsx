/// <reference types="node" />

import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ResultCard } from "./ProductCards";
import type { ProductItem } from "./data";
import { buildResultGroups, RESULT_EXACT_MATCH_LIMIT } from "./result-groups";

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

test("ResultCard renders only product essentials", () => {
  const html = renderToStaticMarkup(<ResultCard item={product} />);

  assert.match(html, /Test Sneaker/);
  assert.match(html, /10 000 ₽/);
  assert.match(html, /Размер: 40/);
  assert.match(html, /Перейти в магазин/);
  assert.doesNotMatch(html, /88% подходит/);
  assert.doesNotMatch(html, /Почему подходит/);
  assert.doesNotMatch(html, /Тестовое объяснение/);
});

test("buildResultGroups explains exact hits as the first API-ranked products", () => {
  const items = Array.from({ length: 5 }, (_, index) => ({
    ...product,
    id: String(index + 1),
    name: `Test Sneaker ${index + 1}`,
  }));

  const groups = buildResultGroups(items);

  assert.equal(groups[0]?.title, "Точное попадание");
  assert.equal(groups[0]?.items.length, RESULT_EXACT_MATCH_LIMIT);
  assert.match(groups[0]?.sub ?? "", /Первые 3 позиции из выдачи API/);
  assert.equal(groups[1]?.title, "Еще варианты");
  assert.equal(groups[1]?.items.length, 2);
  assert.match(groups[1]?.sub ?? "", /Остальные подходящие товары/);
});
