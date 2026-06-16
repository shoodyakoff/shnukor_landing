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
