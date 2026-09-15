import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("home title leads with the searched business names", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");

  assert.match(layout, /const homeTitle = `SES・受託開発・AI導入支援の\$\{siteConfig\.name\}`/);
  // 検索結果・OGP・X のすべてが同じ文言
  assert.equal(layout.match(/(?:default|title): homeTitle,/g)?.length, 3);
});

test("home h1 stays the brand tagline", () => {
  // title だけ事業名に変え、h1 はキャッチコピーのまま残すと決めた（2026-09-15）
  const hero = readFileSync("components/home/Hero.tsx", "utf8");

  assert.match(hero, /<h1 className="palt text-\[44px\][\s\S]*?挑戦と革新で、[\s\S]*?<\/h1>/);
});
