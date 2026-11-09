import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("名刺ページとvCardは検索対象にしない", () => {
  assert.match(readFileSync("app/card/[slug]/page.tsx", "utf8"), /robots: \{ index: false, follow: false \}/);
  const route = readFileSync("app/card/[slug]/vcard/route.ts", "utf8");
  assert.match(route, /"X-Robots-Tag": "noindex, nofollow"/);
  assert.match(route, /Content-Disposition.*inline/);
});

test("通常ナビ・フッター・sitemap・llms.txtに名刺への入口を設けない", () => {
  for (const path of ["lib/site-config.ts", "app/sitemap.ts", "lib/llms-txt.ts", "components/layout/SiteHeader.tsx", "components/layout/SiteFooter.tsx"]) {
    assert.doesNotMatch(readFileSync(path, "utf8"), /\/card(?:\/|["'`])/, path);
  }
});
