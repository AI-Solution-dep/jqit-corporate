import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("SEO-01 uses a lightweight default social image instead of the legacy 6MB PNG", () => {
  const source = read("lib/seo.ts");

  assert.match(source, /url: "\/hero-collage\.webp"/);
  assert.doesNotMatch(source, /url: "\/hero-wide\.png"/);
});

test("SEO-02 service and about pages publish page-specific social images", () => {
  assert.match(read("app/about/page.tsx"), /url: "\/natural-tech-about\.webp"/);
  assert.match(read("app/business/it-solutions/page.tsx"), /url: "\/natural-tech-it\.webp"/);
  assert.match(read("app/business/ai-solutions/page.tsx"), /url: "\/natural-tech-ai\.webp"/);
});

test("AEO-01 explicitly allows answer-engine crawlers", () => {
  const source = read("app/robots.ts");

  for (const agent of ["OAI-SearchBot", "PerplexityBot", "ClaudeBot", "Google-Extended"]) {
    assert.match(source, new RegExp(agent));
  }
});

test("AEO-02 news pages expose authorship and visible modification dates", () => {
  const source = read("app/news/[id]/page.tsx");

  assert.match(source, /発信/);
  assert.match(source, /更新/);
  assert.match(source, /dateModified/);
  assert.match(source, /authorName/);
});

test("AEO-03 about page links verifiable primary sources and publishes Person schema", () => {
  const source = read("app/about/page.tsx");

  assert.match(source, /jstqb\.jp\/partnership/);
  assert.match(source, /jassa\.or\.jp/);
  assert.match(source, /"@type": "Person"/);
  assert.match(source, /"@type": "AboutPage"/);
});

test("SEO-03 static sitemap entries carry substantive modification dates", () => {
  const source = read("app/sitemap.ts");

  assert.match(source, /STATIC_PAGE_LAST_MODIFIED/);
  assert.match(source, /lastModified/);
});

test("SEO-04 publishes the Search Console ownership verification tag", () => {
  const source = read("app/layout.tsx");

  assert.match(source, /verification:\s*\{/);
  assert.match(source, /google:/);
});
