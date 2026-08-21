import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * /column は公開済み。導線とインデックス可能性が揃っていることを保証する。
 * （公開前は tests/column-unlisted.test.mts が逆の内容を保証していた）
 */

test("column pages are indexable", () => {
  const list = readFileSync("app/column/page.tsx", "utf8");
  const detail = readFileSync("app/column/[id]/page.tsx", "utf8");

  assert.doesNotMatch(list, /robots: \{ index: false/);
  // 記事が見つからない場合のみ noindex を返す（存在しないIDのインデックスを防ぐため）
  assert.match(detail, /if \(!column\) return \{ title: "技術コラム", robots: \{ index: false/);
  assert.equal(detail.match(/robots: \{ index: false/g)?.length, 1);
});

test("column is linked from global navigation and footer", () => {
  const config = readFileSync("lib/site-config.ts", "utf8");

  assert.match(config, /label: "技術コラム", en: "Column", href: "\/column"/);
  assert.match(config, /label: "技術コラム", href: "\/column"/);
});

test("column is listed in the sitemap", () => {
  const sitemap = readFileSync("app/sitemap.ts", "utf8");

  assert.match(sitemap, /\$\{base\}\/column`/);
  assert.match(sitemap, /\$\{base\}\/column\/\$\{c\.id\}`/);
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
