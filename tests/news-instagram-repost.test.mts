import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { isInstagramRepost } from "../lib/news-seo-overrides.ts";

// 本番の転記記事（wp-1973）と同じ形の本文
const repostBody =
  '<figure><a href="https://www.instagram.com/p/DOU13Ihkwvj/?utm_source=ig_web_copy_link"><img src="x.png" /></a></figure><p>「Jポーズ」</p>';

test("detects news that only reposts an Instagram post", () => {
  assert.equal(isInstagramRepost({ id: "wp-1973", body: repostBody }), true);
  assert.equal(
    isInstagramRepost({ id: "wp-x", body: '<a href="https://www.instagram.com/reel/abc/">' }),
    true,
  );
});

test("a profile link or an empty body is not a repost", () => {
  // フッター等にあるプロフィールURLは全ページに出るので、転記の判定に使わない
  assert.equal(
    isInstagramRepost({ id: "soukai-202604", body: '<a href="https://www.instagram.com/jqit202412/">' }),
    false,
  );
  assert.equal(isInstagramRepost({ id: "wp-x" }), false);
});

test("SEO articles and certification news stay indexed even with an Instagram post", () => {
  // wp-2011 / wp-2268 は検索向けの解説記事、wp-1975 / wp-2234 は認定取得のニュース
  for (const id of ["wp-2011", "wp-2268", "wp-1975", "wp-2234"]) {
    assert.equal(isInstagramRepost({ id, body: repostBody }), false, id);
  }
});

test("reposts are noindexed and kept out of the sitemap and the home news section", () => {
  const detail = readFileSync("app/news/[id]/page.tsx", "utf8");
  const sitemap = readFileSync("app/sitemap.ts", "utf8");
  const home = readFileSync("components/home/NewsSection.tsx", "utf8");

  assert.match(
    detail,
    /isInstagramRepost\(news\)\s*\?\s*\{ \.\.\.metadata, robots: \{ index: false, follow: true \} \}/,
  );
  assert.match(sitemap, /news\.filter\(\(n\) => !isInstagramRepost\(n\)\)\.map/);
  assert.match(home, /\.filter\(\(n\) => !isInstagramRepost\(n\)\)/);
});
