import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildLlmsTxt } from "../lib/llms-txt.ts";
import { siteConfig } from "../lib/site-config.ts";

const build = (columns: object[] = [], works: object[] = []) =>
  // テストでは表示に使う項目だけを渡す
  buildLlmsTxt({ site: siteConfig, columns: columns as never, works: works as never });

test("LLMS-01 follows the llms.txt layout: H1, summary blockquote, then sections", () => {
  const text = build();
  const lines = text.split("\n");

  assert.equal(lines[0], "# 株式会社JQIT（JQIT Co., Ltd.）");
  assert.equal(lines[1], "");
  assert.match(lines[2], /^> 私たちは、技術の力で/);
  assert.match(text, /^## 事業$/m);
  assert.match(text, /^## Optional$/m);
  assert.ok(text.endsWith("\n"));
});

test("LLMS-02 lists company facts and key pages with absolute URLs", () => {
  const text = build();

  assert.match(text, /- 所在地: 〒101-0047 東京都千代田区内神田1-4-13 THE GATE Otemachi 3階/);
  assert.match(text, /- 設立: 2024年12月6日/);
  assert.match(text, /\(https:\/\/www\.jqit\.co\.jp\/business\/it-solutions\)/);
  assert.match(text, /\(https:\/\/www\.jqit\.co\.jp\/business\/ai-solutions\)/);
  assert.match(text, /\[お問い合わせ\]\(https:\/\/www\.jqit\.co\.jp\/contact\)/);
  assert.doesNotMatch(text, /\]\(\//, "相対URLを含めない");
});

test("LLMS-03 lists HP-original columns but not Qiita-canonical imports", () => {
  const text = build([
    { id: "own-1", title: "自社の記事", excerpt: "要約1行目\n要約2行目", tags: [] },
    {
      id: "imported-1",
      title: "Qiitaからの取り込み",
      qiitaUrl: "https://qiita.com/TMiyamoto/items/abc",
      tags: [],
    },
  ]);

  assert.match(
    text,
    /- \[自社の記事\]\(https:\/\/www\.jqit\.co\.jp\/column\/own-1\): 要約1行目 要約2行目\n/,
  );
  assert.doesNotMatch(text, /imported-1/);
  assert.doesNotMatch(text, /Qiitaからの取り込み/);
});

test("LLMS-04 excludes fallback sample works", () => {
  const text = build(
    [],
    [
      { id: "real-1", title: "実在の実績", summary: "要約", isSample: false },
      { id: "sample-1", title: "サンプル実績", summary: "要約", isSample: true },
    ],
  );

  assert.match(text, /- \[実在の実績\]\(https:\/\/www\.jqit\.co\.jp\/works\/real-1\): 要約/);
  assert.doesNotMatch(text, /sample-1/);
});

test("LLMS-05 route is revalidated by ISR, not pinned to the last deploy", () => {
  const route = readFileSync("app/llms.txt/route.ts", "utf8");

  assert.match(route, /export const revalidate = 3600/);
  // コメント中の注意書きは拾わないよう、行頭の宣言だけを見る
  assert.doesNotMatch(
    route,
    /^export const dynamic/m,
    "force-static を付けると再デプロイまで記事が反映されない",
  );
  assert.match(route, /text\/plain; charset=utf-8/);
});
