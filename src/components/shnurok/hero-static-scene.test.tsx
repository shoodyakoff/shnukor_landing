/// <reference types="node" />

import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Hero } from "./Hero";

test("Hero renders the animated product-flow scene", () => {
  const html = renderToStaticMarkup(<Hero onStart={() => {}} />);

  assert.match(html, /data-scene="hero-loop"/);
  assert.match(html, /Собираем подборку/);
  assert.match(html, /Идеально для тебя/);
  assert.doesNotMatch(html, /data-scene="static-podium"/);
});

test("Hero uses the updated picker copy", () => {
  const html = renderToStaticMarkup(<Hero onStart={() => {}} />);

  assert.match(html, /Подберем кроссовки/);
  assert.match(html, /под твой стиль/);
  assert.match(
    html,
    /Расскажите нам о своих предпочтениях, а мы найдем кроссовки, которые действительно попадают в сердечко\./,
  );
  assert.doesNotMatch(html, /Соберем подборку/);
  assert.doesNotMatch(html, /Пара коротких шагов/);
});
