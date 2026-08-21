import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * /column は公開前ページ。1本目の記事を公開するまで、ヘッダー・フッター・
 * サイトマップに出さず noindex を維持していることを保証する。
 * 公開する際はこのテストごと更新すること。
 */

test("column pages stay noindex until launch", () => {
  const list = readFileSync("app/column/page.tsx", "utf8");
  const detail = readFileSync("app/column/[id]/page.tsx", "utf8");

  assert.match(list, /robots: \{ index: false, follow: false \}/);
  assert.match(detail, /robots: \{ index: false, follow: false \}/);
});

test("column is not linked from global navigation or footer", () => {
  const config = readFileSync("lib/site-config.ts", "utf8");

  assert.doesNotMatch(config, /"\/column"/);
});

test("column is not listed in the sitemap", () => {
  const sitemap = readFileSync("app/sitemap.ts", "utf8");

  assert.doesNotMatch(sitemap, /\/column/);
});

test("column rich text goes through the shared sanitizer", () => {
  const source = readFileSync("lib/column.ts", "utf8");

  assert.match(source, /body: prepareRichTextHtml\(item\.body \?\? item\.content\)/);
});

test("qiitaUrl is validated before being rendered as a link", () => {
  const source = readFileSync("lib/column.ts", "utf8");

  // CMS 由来の文字列をそのまま href にしない（javascript: 等を弾く）
  assert.match(source, /qiitaUrl: safeHttpsUrl\(item\.qiitaUrl\)/);
  assert.match(source, /url\.protocol === "https:"/);
});
