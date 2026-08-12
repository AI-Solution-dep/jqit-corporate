import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getNewsSeoOverride } from "../lib/news-seo-overrides.ts";

test("business pages lead search snippets with specific services", () => {
  const it = readFileSync("app/business/it-solutions/page.tsx", "utf8");
  const ai = readFileSync("app/business/ai-solutions/page.tsx", "utf8");

  assert.match(it, /title: "システム開発・SES・QAのITソリューション"/);
  assert.match(ai, /title: "AI導入支援・AIエージェント開発"/);
});

test("SES article answers the abbreviation and links it to practical choices", () => {
  const override = getNewsSeoOverride("wp-2011");

  assert.equal(override?.title, "SESとは？意味・仕組み・受託開発との違いを解説");
  assert.match(override?.summary ?? "", /System Engineering Service/);
  assert.ok((override?.faqs.length ?? 0) >= 3);
});

test("API article uses a query-matching title and direct definition", () => {
  const override = getNewsSeoOverride("wp-2268");

  assert.equal(override?.title, "APIとは？仕組み・具体例をわかりやすく解説");
  assert.match(override?.summary ?? "", /Application Programming Interface/);
  assert.ok((override?.keyPoints.length ?? 0) >= 3);
});
