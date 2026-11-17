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
