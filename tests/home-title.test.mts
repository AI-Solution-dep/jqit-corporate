import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("home title leads with the company name", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");

  // 会社名の検索でトップが会社情報より上に出るよう、会社名を先頭に置く（2026-11-19）
  assert.match(layout, /const homeTitle = `\$\{siteConfig\.name\}｜DX・AI推進の伴走パートナー`/);
  // 検索結果・OGP・X のすべてが同じ文言
  assert.equal(layout.match(/(?:default|title): homeTitle,/g)?.length, 3);
});

test("home h1 stays the brand tagline", () => {
  // title と h1 は別にし、h1 はキャッチコピーのまま残すと決めた（2026-09-15）
  const hero = readFileSync("components/home/Hero.tsx", "utf8");

  assert.match(hero, /<h1 className="palt text-\[44px\][\s\S]*?挑戦と革新で、[\s\S]*?<\/h1>/);
});
