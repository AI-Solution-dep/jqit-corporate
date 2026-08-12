import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * /works は公開前ページ。ヘッダー・フッター・サイトマップに出さず、
 * noindex を維持していることを保証する。公開する際はこのテストごと更新すること。
 */

test("works pages stay noindex until launch", () => {
  const list = readFileSync("app/works/page.tsx", "utf8");
  const detail = readFileSync("app/works/[id]/page.tsx", "utf8");

  assert.match(list, /robots: \{ index: false, follow: false \}/);
  assert.match(detail, /robots: \{ index: false, follow: false \}/);
});

test("works is not linked from global navigation or footer", () => {
  const config = readFileSync("lib/site-config.ts", "utf8");

  assert.doesNotMatch(config, /"\/works"/);
});

test("works is not listed in the sitemap", () => {
  const sitemap = readFileSync("app/sitemap.ts", "utf8");

  assert.doesNotMatch(sitemap, /\/works/);
});

test("works rich text goes through the shared sanitizer", () => {
  const source = readFileSync("lib/works.ts", "utf8");

  for (const field of ["challenge", "approach", "result", "body"]) {
    assert.match(
      source,
      new RegExp(`${field}: prepareRichTextHtml\\(item\\.${field}\\)`),
      `${field} must be sanitized before rendering`,
    );
  }
});
