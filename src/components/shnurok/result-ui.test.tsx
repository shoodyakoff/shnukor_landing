/// <reference types="node" />

import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Results } from "./FlowResultScreens";
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

test("Results renders all products without exact and other grouping", () => {
  const items = Array.from({ length: 5 }, (_, index) => ({
    ...product,
    id: String(index + 1),
    name: `Test Sneaker ${index + 1}`,
  }));
  const selections: Selections = {
    sizes: ["EU 40"],
    colors: ["purple"],
    price: "p3",
    task: "daily",
    styleVotes: {},
  };

  const html = renderToStaticMarkup(
    <Results sel={selections} items={items} onReset={() => {}} onWiden={() => {}} />,
  );

  assert.match(html, /Нашли 5 моделей под твой запрос/);
  assert.match(html, /Цвет:/);
  assert.match(html, /Фиолетовый/);
  assert.doesNotMatch(html, /Точное попадание/);
  assert.doesNotMatch(html, /Еще варианты/);
  assert.doesNotMatch(html, /Первые 3 позиции из выдачи API/);
  assert.doesNotMatch(html, /Остальные подходящие товары/);
  for (const item of items) {
    assert.match(html, new RegExp(item.name));
  }
});
