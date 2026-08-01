import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import * as contactServerModule from "../lib/contact-submission.ts";

/**
 * Traceability:
 * FORM-07 -> F12（お問い合わせ種別ごとの宛先選択）
 * FORM-11 -> F10（入力制限・無効同値クラス）/ F11（honeypot・レート制御の委譲）
 * SEC-01  -> F11（honeypot）/ F13-01〜02（セキュリティヘッダー）
 * NAV-03  -> F13-03（サイトマップ導線）
 */
type ContactSchema = {
  safeParse(input: unknown):
    | { success: true; data: unknown }
    | {
        success: false;
        error: { issues: Array<{ path: PropertyKey[]; message: string }> };
      };
};

function getContactSchema(): ContactSchema {
  assert.equal(
    typeof contactServerModule.contactSchema,
    "object",
    "contactSchema must be exported from lib/contact-submission.ts",
  );
  const schema = contactServerModule.contactSchema as { safeParse?: unknown };
  assert.equal(typeof schema.safeParse, "function");
  return schema as ContactSchema;
}

function getFieldIssue(result: ReturnType<ContactSchema["safeParse"]>, field: string) {
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

const validContactInput = {
  name: "山田 太郎",
  company: "株式会社JQIT",
  email: "taro@example.com",
  tel: "03-1234-5678",
  category: "サービスについて",
  message: "相談内容",
  privacy: "on",
};

const email254 = `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(61)}`;
const email255 = `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(62)}`;

const boundaryCases = [
  { id: "F10-01", field: "name", value: "", valid: false, message: "お名前を入力してください" },
  { id: "F10-02", field: "name", value: "a", valid: true },
  { id: "F10-03", field: "name", value: "a".repeat(100), valid: true },
  { id: "F10-04", field: "name", value: "a".repeat(101), valid: false, message: "お名前は100文字以内で入力してください" },
  { id: "F10-05", field: "company", value: "", valid: true },
  { id: "F10-06", field: "company", value: "a", valid: true },
  { id: "F10-07", field: "company", value: "a".repeat(200), valid: true },
  { id: "F10-08", field: "company", value: "a".repeat(201), valid: false, message: "会社名は200文字以内で入力してください" },
  { id: "F10-09", field: "email", value: "", valid: false, message: "メールアドレスを入力してください" },
  { id: "F10-10", field: "email", value: "a@example.com", valid: true },
  { id: "F10-11", field: "email", value: email254, valid: true },
  { id: "F10-12", field: "email", value: email255, valid: false, message: "メールアドレスは254文字以内で入力してください" },
  { id: "F10-13", field: "tel", value: "", valid: true },
  { id: "F10-14", field: "tel", value: "1", valid: true },
  { id: "F10-15", field: "tel", value: "1".repeat(30), valid: true },
  { id: "F10-16", field: "tel", value: "1".repeat(31), valid: false, message: "電話番号は30文字以内で入力してください" },
  { id: "F10-17", field: "message", value: "", valid: false, message: "お問い合わせ内容を入力してください" },
  { id: "F10-18", field: "message", value: "a", valid: true },
  { id: "F10-19", field: "message", value: "a".repeat(5000), valid: true },
  { id: "F10-20", field: "message", value: "a".repeat(5001), valid: false, message: "お問い合わせ内容は5000文字以内で入力してください" },
] as const;

for (const boundary of boundaryCases) {
  test(`${boundary.id}: ${boundary.field}=${boundary.value.length}文字の境界値を判定する`, () => {
    const result = getContactSchema().safeParse({
      ...validContactInput,
      [boundary.field]: boundary.value,
    });

    assert.equal(result.success, boundary.valid);
    assert.equal(
      getFieldIssue(result, boundary.field),
      "message" in boundary ? boundary.message : undefined,
    );
  });
}

test("F10-21: 未知のお問い合わせ種別を拒否する", () => {
  const result = getContactSchema().safeParse({
    ...validContactInput,
    category: "未知の種別",
  });

  assert.equal(result.success, false);
  assert.equal(
    getFieldIssue(result, "category"),
    "お問い合わせ種別を選択してください",
  );
});

const whitespaceCases = [
  {
    id: "F10-22",
    field: "name",
    value: " \t\n ",
    message: "お名前を入力してください",
  },
  {
    id: "F10-23",
    field: "message",
    value: " \t\n ",
    message: "お問い合わせ内容を入力してください",
  },
] as const;

for (const invalid of whitespaceCases) {
  test(`${invalid.id}: ${invalid.field} が空白のみなら必須エラーにする`, () => {
    const result = getContactSchema().safeParse({
      ...validContactInput,
      [invalid.field]: invalid.value,
    });

    assert.equal(result.success, false);
    assert.equal(getFieldIssue(result, invalid.field), invalid.message);
  });
}

const nonStringCases = [
  { id: "F10-24", field: "name", message: "お名前は文字列で入力してください" },
  { id: "F10-25", field: "company", message: "会社名は文字列で入力してください" },
  { id: "F10-26", field: "email", message: "メールアドレスは文字列で入力してください" },
  { id: "F10-27", field: "tel", message: "電話番号は文字列で入力してください" },
  { id: "F10-28", field: "message", message: "お問い合わせ内容は文字列で入力してください" },
] as const;

for (const invalid of nonStringCases) {
  test(`${invalid.id}: ${invalid.field} が File なら型エラーにする`, () => {
    const result = getContactSchema().safeParse({
      ...validContactInput,
      [invalid.field]: new File(["bot"], "bot.txt", { type: "text/plain" }),
    });

    assert.equal(result.success, false);
    assert.equal(getFieldIssue(result, invalid.field), invalid.message);
  });
}

const invalidEmailCases = [
  { id: "F10-29", value: "user.example.com", description: "@なし", message: "メールアドレスの形式が正しくありません" },
  { id: "F10-30", value: "@example.com", description: "ローカル部なし", message: "メールアドレスの形式が正しくありません" },
  { id: "F10-31", value: "user@", description: "ドメインなし", message: "メールアドレスの形式が正しくありません" },
  { id: "F10-32", value: " \t ", description: "空白のみ", message: "メールアドレスを入力してください" },
] as const;

for (const invalid of invalidEmailCases) {
  test(`${invalid.id}: ${invalid.description}のメールアドレスを拒否する`, () => {
    const result = getContactSchema().safeParse({
      ...validContactInput,
      email: invalid.value,
    });

    assert.equal(result.success, false);
    assert.equal(getFieldIssue(result, "email"), invalid.message);
  });
}

const invalidPrivacyCases = [
  { id: "F10-33", value: undefined, description: "未送信" },
  { id: "F10-34", value: "yes", description: "on以外" },
] as const;

for (const invalid of invalidPrivacyCases) {
  test(`${invalid.id}: privacy が${invalid.description}なら同意エラーにする`, () => {
    const result = getContactSchema().safeParse({
      ...validContactInput,
      privacy: invalid.value,
    });

    assert.equal(result.success, false);
    assert.equal(
      getFieldIssue(result, "privacy"),
      "プライバシーポリシーへの同意が必要です",
    );
  });
}

test("F10-35: 必須項目がすべて空なら各項目の具体的エラーを返す", () => {
  const result = getContactSchema().safeParse({
    ...validContactInput,
    name: "",
    email: "",
    category: "",
    message: "",
    privacy: "",
  });

  assert.equal(result.success, false);
  assert.deepEqual(
    Object.fromEntries(
      ["name", "email", "category", "message", "privacy"].map((field) => [
        field,
        getFieldIssue(result, field),
      ]),
    ),
    {
      name: "お名前を入力してください",
      email: "メールアドレスを入力してください",
      category: "お問い合わせ種別を選択してください",
      message: "お問い合わせ内容を入力してください",
      privacy: "プライバシーポリシーへの同意が必要です",
    },
  );
});

const honeypotCases = [
  { id: "F11-01", value: "", expected: false, description: "空文字" },
  { id: "F11-02", value: "https://bot.example", expected: true, description: "入力済み文字列" },
  { id: "F11-03", value: " ", expected: true, description: "空白文字列" },
  { id: "F11-04", value: { filename: "bot.txt" }, expected: true, description: "文字列以外" },
] as const;

for (const honeypot of honeypotCases) {
  test(`${honeypot.id}: website が${honeypot.description}ならボット判定=${honeypot.expected}`, () => {
    assert.equal(
      typeof contactServerModule.isContactHoneypotTriggered,
      "function",
      "isContactHoneypotTriggered must be exported from lib/contact-submission.ts",
    );
    const isTriggered = contactServerModule.isContactHoneypotTriggered as (
      value: unknown,
    ) => boolean;

    assert.equal(isTriggered(honeypot.value), honeypot.expected);
  });
}

test("F11-05: submitContact は FormData と送信コールバックを送信コアへ委譲する", () => {
  const source = readFileSync("app/contact/actions.ts", "utf8");

  assert.match(source, /processContactSubmission/);
  assert.match(source, /processContactSubmission\(\s*formData,\s*process\.env,/);
  assert.match(source, /const \{ Resend \} = await import\("resend"\)/);
  assert.doesNotMatch(source, /contactSchema\.safeParse|new Map|fieldErrors\.website/);
});

const recipientCases = [
  { id: "F12-01", category: "サービスについて", specialized: true, expected: "sales@example.com" },
  { id: "F12-02", category: "採用について", specialized: true, expected: "recruit@example.com" },
  { id: "F12-03", category: "協業・パートナーについて", specialized: true, expected: "sales@example.com" },
  { id: "F12-04", category: "取材・メディアについて", specialized: true, expected: "sales@example.com" },
  { id: "F12-05", category: "その他", specialized: true, expected: "sales@example.com" },
  { id: "F12-06", category: "サービスについて", specialized: false, expected: "fallback@example.com" },
  { id: "F12-07", category: "採用について", specialized: false, expected: "fallback@example.com" },
  { id: "F12-08", category: "協業・パートナーについて", specialized: false, expected: "fallback@example.com" },
  { id: "F12-09", category: "取材・メディアについて", specialized: false, expected: "fallback@example.com" },
  { id: "F12-10", category: "その他", specialized: false, expected: "fallback@example.com" },
] as const;

for (const route of recipientCases) {
  test(`${route.id}: ${route.category}を${route.specialized ? "専用" : "共通"}宛先へ振り分ける`, () => {
    assert.equal(
      typeof contactServerModule.getContactRecipients,
      "function",
      "getContactRecipients must be exported from lib/contact-submission.ts",
    );
    const getRecipients = contactServerModule.getContactRecipients as (
      category: string,
      env: Record<string, string | undefined>,
    ) => string | undefined;
    const env = route.specialized
      ? {
          CONTACT_TO: "fallback@example.com",
          CONTACT_TO_SALES: "sales@example.com",
          CONTACT_TO_RECRUIT: "recruit@example.com",
        }
      : { CONTACT_TO: "fallback@example.com" };

    assert.equal(getRecipients(route.category, env), route.expected);
  });
}

test("F13-01: 動的配信設定は全パスへ具体的なセキュリティヘッダーを返す", () => {
  const source = readFileSync("next.config.ts", "utf8");
  const requiredFragments = [
    'source: "/:path*"',
    'key: "Content-Security-Policy"',
    "default-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-src https://www.google.com",
    "upgrade-insecure-requests",
    'key: "X-Content-Type-Options", value: "nosniff"',
    'key: "Referrer-Policy", value: "strict-origin-when-cross-origin"',
    'key: "Permissions-Policy"',
    'value: "camera=(), microphone=(), geolocation=()"',
    'key: "X-Frame-Options", value: "DENY"',
  ];

  for (const fragment of requiredFragments) {
    assert.equal(source.includes(fragment), true, `missing config fragment: ${fragment}`);
  }
});

test("F13-02: 静的・動的両ブランチで X-Powered-By を無効化する", () => {
  const source = readFileSync("next.config.ts", "utf8");
  assert.equal(source.match(/poweredByHeader:\s*false/g)?.length, 2);
});

test("F13-03: フッターのサイトマップは XML エンドポイントへリンクする", () => {
  const source = readFileSync("components/layout/SiteFooter.tsx", "utf8");
  assert.match(source, /href="\/sitemap\.xml"[^>]*>\s*サイトマップ/);
  assert.doesNotMatch(source, /href="#"[^>]*>\s*サイトマップ/);
});
