import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

test("紹介ページは検索インデックスへの登録を許可しない", () => {
  const source = readFileSync("app/introduction/page.tsx", "utf8");
  assert.match(source, /robots: \{ index: false, follow: false \}/);
});

test("紹介ページの入口をサイトの他ページ・ナビ・サイトマップに設けない", () => {
  function checkDirectory(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (path === "app/introduction") continue;
      if (entry.isDirectory()) checkDirectory(path);
      else if (/\.(tsx?|json)$/.test(path)) {
        // ルート判定は入口リンクではない。専用表示への切り替えだけを許可する。
        if (path === "components/layout/PublicSiteChrome.tsx") {
          assert.doesNotMatch(readFileSync(path, "utf8"), /href\s*=/);
          continue;
        }
        assert.doesNotMatch(readFileSync(path, "utf8"), /["'`]\/?(?:https:\/\/www\.jqit\.co\.jp\/)?introduction(?:["'`/#?])/, `${path} に入口を追加しない`);
      }
    }
  }
  for (const directory of ["app", "components", "lib"]) checkDirectory(directory);
});

test("紹介ページに担当者個人の携帯番号・メールアドレスを載せない（共通窓口のみ）", () => {
  const config = readFileSync("lib/site-config.ts", "utf8");
  const start = config.indexOf("export const introductionContacts");
  const block = config.slice(start, config.indexOf("} as const;", start));
  assert.doesNotMatch(block, /0[789]0-?\d{4}-?\d{4}/, "個人の携帯番号を載せない");
  assert.doesNotMatch(block, /[a-z]\.[a-z]+@jqit\.co\.jp/, "個人のメールアドレスを載せない");
  const page = readFileSync("app/introduction/page.tsx", "utf8");
  assert.doesNotMatch(page, /person\.(email|phone)/, "担当者ごとの連絡先リンクを出さない");
});
