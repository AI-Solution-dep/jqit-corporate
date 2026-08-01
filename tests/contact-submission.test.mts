import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { processContactSubmission } from "../lib/contact-submission.ts";

/**
 * Traceability:
 * MAIL-AUTO-02/07 -> F14-23〜24
 * MAIL-AUTO-06 -> F14-01〜03, F14-25〜27
 * R-CONTACT-04 -> F14-25〜27
 * R-CONTACT-06 -> F14-01〜03
 * R-CONTACT-08 -> F14-25〜26
 */
type EmailPayload = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

function makeFormData(
  overrides: Record<string, string | Blob | undefined> = {},
): FormData {
  const values: Record<string, string | Blob | undefined> = {
    name: "山田 太郎",
    company: "株式会社JQIT",
    email: "taro@example.com",
    tel: "03-1234-5678",
    category: "サービスについて",
    message: "導入について相談したいです",
    privacy: "on",
    ...overrides,
  };
  const formData = new FormData();
  for (const [name, value] of Object.entries(values)) {
    if (value !== undefined) formData.append(name, value);
  }
  return formData;
}

const configuredEnv = {
  NODE_ENV: "production",
  RESEND_API_KEY: "re_test_key",
  CONTACT_FROM: "JQIT Web <web@example.com>",
  CONTACT_TO: "fallback@example.com",
  CONTACT_TO_SALES: "sales@example.com",
  CONTACT_TO_RECRUIT: "recruit@example.com",
};

const honeypotValues = [
  { id: "F14-01", value: "https://bot.example", description: "文字列" },
  {
    id: "F14-02",
    value: new Blob(["bot"], { type: "text/plain" }),
    description: "File相当の非文字列",
  },
] as const;

for (const honeypot of honeypotValues) {
  test(`${honeypot.id}: MAIL-AUTO-06 website が${honeypot.description}なら送信せず成功を返す`, async () => {
    const sent: EmailPayload[] = [];

    const result = await processContactSubmission(
      makeFormData({ website: honeypot.value }),
      configuredEnv,
      async (payload) => {
        sent.push(payload);
      },
    );

    assert.deepEqual(result, { status: "success", fieldErrors: {} });
    assert.deepEqual(sent, []);
  });
}

test("F14-03: MAIL-AUTO-06 無効な FormData は項目別エラーとなり送信しない", async () => {
  const sent: EmailPayload[] = [];

  const result = await processContactSubmission(
    makeFormData({
      name: "",
      email: "invalid",
      category: "unknown",
      message: "",
      privacy: undefined,
    }),
    configuredEnv,
    async (payload) => {
      sent.push(payload);
    },
  );

  assert.deepEqual(result, {
    status: "error",
    fieldErrors: {
      name: "お名前を入力してください",
      email: "メールアドレスの形式が正しくありません",
      category: "お問い合わせ種別を選択してください",
      message: "お問い合わせ内容を入力してください",
      privacy: "プライバシーポリシーへの同意が必要です",
    },
  });
  assert.deepEqual(sent, []);
});

const productionMissingConfigCases = [
  {
    id: "F14-25",
    description: "APIキーなし",
    env: {
      NODE_ENV: "production",
      CONTACT_TO_SALES: "sales@example.com",
    },
  },
  {
    id: "F14-26",
    description: "宛先なし",
    env: { NODE_ENV: "production", RESEND_API_KEY: "re_test_key" },
  },
] as const;

for (const missing of productionMissingConfigCases) {
  test(`${missing.id}: MAIL-AUTO-06 本番${missing.description}はPIIを記録せず電話案内エラーを返す`, async () => {
    const sent: EmailPayload[] = [];
    const errors: unknown[][] = [];
    const logs: unknown[][] = [];

    const result = await processContactSubmission(
      makeFormData({
        name: "NAME_CONFIG_SECRET",
        email: "config-secret@example.com",
        message: "MESSAGE_CONFIG_SECRET",
      }),
      missing.env,
      async (payload) => {
        sent.push(payload);
      },
      {
        error: (...args) => errors.push(args),
        log: (...args) => logs.push(args),
      },
    );

    assert.deepEqual(result, {
      status: "error",
      fieldErrors: {},
      formError:
        "現在フォームを利用できません。お手数ですが TEL 03-6433-5383（平日 10:00 - 19:00）までご連絡ください。",
    });
    assert.deepEqual({ sent, logs, errors }, {
      sent: [],
      logs: [],
      errors: [[
        "[contact] RESEND_API_KEY/CONTACT_TO が未設定のため送信できません（内容は記録していません）",
      ]],
    });
    assert.equal(
      JSON.stringify({ errors, logs }).includes("CONFIG_SECRET"),
      false,
    );
  });
}

test("F14-27: MAIL-AUTO-06 非本番の設定不足は固定ログ1件で送信を省略し成功を返す", async () => {
  const sent: EmailPayload[] = [];
  const errors: unknown[][] = [];
  const logs: unknown[][] = [];

  const result = await processContactSubmission(
    makeFormData({
      name: "NAME_DEV_SECRET",
      email: "dev-secret@example.com",
      message: "MESSAGE_DEV_SECRET",
    }),
    { NODE_ENV: "development" },
    async (payload) => {
      sent.push(payload);
    },
    {
      error: (...args) => errors.push(args),
      log: (...args) => logs.push(args),
    },
  );

  assert.deepEqual(result, { status: "success", fieldErrors: {} });
  assert.deepEqual({ sent, errors, logs }, {
    sent: [],
    errors: [],
    logs: [["[contact] メール未接続のため送信を省略しました"]],
  });
  assert.equal(
    JSON.stringify({ errors, logs }).includes("DEV_SECRET"),
    false,
  );
});

test("F14-23: MAIL-AUTO-07 CONTACT_FROM 未設定なら2通とも既定送信元を使う", async () => {
  const sent: EmailPayload[] = [];

  await processContactSubmission(
    makeFormData(),
    { ...configuredEnv, CONTACT_FROM: undefined },
    async (payload) => {
      sent.push(payload);
    },
  );

  assert.deepEqual(
    sent.map(({ from }) => from),
    [
      "JQIT Corporate <onboarding@resend.dev>",
      "JQIT Corporate <onboarding@resend.dev>",
    ],
  );
});

test("F14-24: MAIL-AUTO-02 受付メールの会社情報は siteConfig の各フィールドを参照する", () => {
  const source = readFileSync("lib/contact-submission.ts", "utf8");
  const requiredReferences = [
    "siteConfig.name",
    "siteConfig.addressLines",
    "siteConfig.tel",
    "siteConfig.businessHours",
    "siteConfig.url",
  ];

  assert.deepEqual(
    requiredReferences.filter((reference) => !source.includes(reference)),
    [],
  );
  assert.doesNotMatch(
    source,
    /〒150-0002 東京都渋谷区渋谷1-12-2|クロスオフィス渋谷609|03-6433-5383|https:\/\/www\.jqit\.co\.jp/,
  );
});
