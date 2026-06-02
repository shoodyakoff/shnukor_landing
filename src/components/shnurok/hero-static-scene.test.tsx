/// <reference types="node" />

import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Hero } from "./Hero";

test("Hero renders the selected flat-hand product scene", () => {
  const html = renderToStaticMarkup(<Hero onStart={() => {}} />);

  assert.match(html, /data-scene="static-podium"/);
  assert.match(html, /hero-flat-hand-close\.png/);
  assert.match(html, /Кроссовок на подиуме с рукой/);
  assert.doesNotMatch(html, /hero-motion/);
  assert.doesNotMatch(html, /hero-scene-/);
});
