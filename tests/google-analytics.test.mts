import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { contactCategories, contactCategoryAnalyticsKey } from "../lib/contact.ts";

const read = (path: string) => readFileSync(path, "utf8");

test("GA-01 loads the configured GA4 measurement tag from the root layout", () => {
  const layout = read("app/layout.tsx");
  const component = read("components/seo/GoogleAnalytics.tsx");
  const analytics = read("lib/analytics.ts");
  const nextConfig = read("next.config.ts");

  assert.match(layout, /<GoogleAnalytics \/>/);
  assert.match(component, /googletagmanager\.com\/gtag\/js/);
  assert.match(component, /gtag\('config'/);
  assert.match(analytics, /G-4PB4361MG2/);
  assert.match(nextConfig, /script-src[^\n]+www\.googletagmanager\.com/);
  assert.match(nextConfig, /connect-src[^\n]+google-analytics\.com/);
});

test("GA-02 records a lead only after the contact form succeeds", () => {
  const form = read("components/contact/ContactForm.tsx");

  assert.match(form, /state\.status !== "success"/);
  assert.match(form, /conversionTrackedRef\.current/);
  assert.match(form, /trackGoogleAnalyticsEvent\("generate_lead"/);
  assert.match(form, /form_name: "corporate_contact"/);
});

test("GA-03 sends the inquiry category with the lead so sales pitches can be excluded", () => {
  const form = read("components/contact/ContactForm.tsx");
  assert.match(form, /inquiry_category: contactCategoryAnalyticsKey\(category\)/);

  const keys = contactCategories.map(contactCategoryAnalyticsKey);
  for (const key of keys) assert.match(key, /^[a-z_]+$/);
  assert.equal(new Set(keys).size, contactCategories.length);

  assert.equal(contactCategoryAnalyticsKey("サービスについて"), "service");
  assert.equal(contactCategoryAnalyticsKey("営業のご提案・サービス紹介"), "sales_pitch");
  assert.equal(contactCategoryAnalyticsKey("存在しない種別"), "unknown");
  assert.equal(contactCategoryAnalyticsKey(""), "unknown");
});
