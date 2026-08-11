import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const carouselSource = readFileSync("components/home/HeroCarousel.tsx", "utf8");
const heroSource = readFileSync("components/home/Hero.tsx", "utf8");
const styles = readFileSync("app/globals.css", "utf8");

test("トップ画像は既存KVを先頭にした4枚構成である", () => {
  const imageSources = [...carouselSource.matchAll(/src: "([^"]+)"/g)].map(
    ([, src]) => src,
  );

  assert.deepEqual(imageSources, [
    "/hero-collage.webp",
    "/hero-customer-workshop.webp",
    "/hero-ai-development.webp",
    "/hero-office-district-dusk.webp",
  ]);
  assert.match(heroSource, /<HeroCarousel \/>/);
});

test("自動切り替えは停止でき、モーション軽減設定を尊重する", () => {
  assert.match(carouselSource, /ROTATION_INTERVAL_MS = 7_000/);
  assert.match(carouselSource, /prefers-reduced-motion: reduce/);
  assert.match(carouselSource, /aria-pressed=\{isPaused\}/);
  assert.match(carouselSource, /window\.setTimeout/);
  assert.match(styles, /\.hero-media-slide/);
  assert.match(styles, /\.hero-media-drift/);
});

test("ヒーロー画像を再圧縮せず、拡大を抑えて鮮明に表示する", () => {
  assert.match(carouselSource, /unoptimized/);
  assert.match(styles, /scale\(1\.018\)/);
  assert.doesNotMatch(styles, /scale\(1\.045\)/);
});

test("前面の透明領域が画像切り替え操作を遮らない", () => {
  assert.match(heroSource, /pointer-events-none relative z-10/);
  assert.match(heroSource, /pointer-events-auto max-w-\[640px\]/);
});
