import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteConfig } from "../lib/site-config.ts";

test("company address is the Otemachi office", () => {
  const config = readFileSync("lib/site-config.ts", "utf8");

  assert.match(config, /address: "〒101-0047 東京都千代田区内神田1-4-13 THE GATE Otemachi 3階"/);
  assert.match(config, /officeName: "大手町オフィス"/);
  assert.doesNotMatch(config, /渋谷|クロスオフィス|150-0002/);
});

test("office name is shown only where the office is introduced", () => {
  const about = readFileSync("app/about/page.tsx", "utf8");
  const footer = readFileSync("components/layout/SiteFooter.tsx", "utf8");

  assert.match(about, /\{ k: "所在地", v: `\$\{siteConfig\.address\}（\$\{siteConfig\.officeName\}）` \}/);
  assert.match(about, /<Kicker className="mb-3">Office<\/Kicker>\s*<p[^>]*>\s*\{siteConfig\.officeName\}/);
  // フッターは宛先形式の住所だけを出す
  assert.doesNotMatch(footer, /officeName/);
});

test("footer puts the postal code on its own line", () => {
  const footer = readFileSync("components/layout/SiteFooter.tsx", "utf8");

  // 表示: 〒101-0047 / 東京都千代田区内神田1-4-13 / THE GATE Otemachi 3階
  assert.match(footer, /\{footerPostalCode\}\s*<br \/>\s*\{footerStreet\.join\(" "\)\}\s*<br \/>\s*\{siteConfig\.addressLines\[1\]\}/);
  const [postalCode, ...street] = siteConfig.addressLines[0].split(" ");
  assert.equal(postalCode, "〒101-0047");
  assert.equal(street.join(" "), "東京都千代田区内神田1-4-13");
  // メール署名と共用のデータは1行のまま
  assert.equal(siteConfig.addressLines[0], "〒101-0047 東京都千代田区内神田1-4-13");
});
