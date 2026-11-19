import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("service navigation exposes NOVA and AI implementation support", () => {
  const config = readFileSync("lib/site-config.ts", "utf8");
  const serviceNav = config.match(
    /label: "サービス"[\s\S]*?(?=\n  \{ label: "ニュース")/,
  )?.[0];

  assert.ok(serviceNav);
  assert.match(serviceNav, /en: "Service"/);
  assert.match(serviceNav, /href: "\/#service"/);
  assert.match(serviceNav, /label: "NOVA"[\s\S]*?external: true/);
  assert.match(serviceNav, /label: "AI導入伴走支援"[\s\S]*?external: true/);
  assert.match(config, /aiSupport: "https:\/\/ai\.jqit\.co\.jp\/"/);
});

test("desktop and mobile service children support safe external links", () => {
  const source = readFileSync("components/layout/SiteHeader.tsx", "utf8");
  assert.equal(source.match(/target=\{child\.external \? "_blank" : undefined\}/g)?.length, 2);
  assert.equal(
    source.match(/rel=\{child\.external \? "noopener noreferrer" : undefined\}/g)?.length,
    2,
  );
});

test("home service section presents both external destinations", () => {
  const source = readFileSync("components/home/ServiceSection.tsx", "utf8");
  // 巨大な透かし英字（SERVICES）は外した（2026-11-19）。肩ラベルで確かめる
  assert.match(source, /Services/);
  assert.match(source, /siteConfig\.links\.nova/);
  assert.match(source, /siteConfig\.links\.aiSupport/);
  assert.match(source, /AI導入伴走支援/);
});
