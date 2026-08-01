import assert from "node:assert/strict";
import test from "node:test";
import { processContactSubmission } from "../lib/contact-submission.ts";

/**
 * Traceability:
 * MAIL-AUTO-01 -> F14-04, F14-14〜15, F14-17
 * MAIL-AUTO-02 -> F14-14, F14-16〜20, F14-24
 * MAIL-AUTO-03 -> F14-04〜13
 * MAIL-AUTO-04 -> F14-21
 * MAIL-AUTO-05 -> F14-22
 * MAIL-AUTO-07 -> F14-14, F14-23
 * R-CONTACT-01 -> F14-14, F14-21
 * R-CONTACT-02 -> F14-22
 * R-CONTACT-03 -> F14-04〜13
 * R-CONTACT-04 -> F14-21〜22
 * R-CONTACT-05 -> F14-14, F14-16〜20
 * R-CONTACT-09 -> F14-14
 */
type EmailPayload = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

function makeFormData(overrides: Record<string, string | undefined> = {}) {
  const values: Record<string, string | undefined> = {
    name: "山田 太郎",
    company: "株式会社サンプル",
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

const fixedNow = () => new Date("2026-08-02T03:04:00.000Z");

const receiptText = [
  "お問い合わせいただいたお客様へ",
  "",
  "この度は、株式会社JQITへお問い合わせいただき、誠にありがとうございます。",
  "以下の内容でお問い合わせを受け付けました。",
  "",
  "■ お問い合わせ日時",
  "2026年08月02日 12:04（日本時間）",
  "",
  "■ お名前",
  "山田 太郎",
  "",
  "■ 会社名",
  "株式会社サンプル",
  "",
  "■ メールアドレス",
  "taro@example.com",
  "",
  "■ 電話番号",
  "03-1234-5678",
  "",
  "■ お問い合わせ種別",
  "サービスについて",
  "",
  "■ お問い合わせ内容",
  "導入について相談したいです",
  "",
  "担当者が内容を確認のうえ、原則2〜3営業日以内にご連絡いたします。",
  "お問い合わせ内容によっては、回答までお時間をいただく場合があります。あらかじめご了承ください。",
  "",
  "このメールは、お問い合わせの受付をお知らせする自動送信メールです。",
  "本メールにお心当たりがない場合は、お手数ですが破棄してください。",
  "",
  "──────────────────",
  "株式会社JQIT",
  "〒150-0002 東京都渋谷区渋谷1-12-2",
  "クロスオフィス渋谷609",
  "TEL: 03-6433-5383",
  "営業時間: 平日 10:00 - 19:00",
  "https://www.jqit.co.jp",
  "──────────────────",
].join("\n");

const routingCases = [
  { id: "F14-04", category: "サービスについて", dedicated: true, route: "sales@example.com" },
  { id: "F14-05", category: "採用について", dedicated: true, route: "recruit@example.com" },
  { id: "F14-06", category: "協業・パートナーについて", dedicated: true, route: "sales@example.com" },
  { id: "F14-07", category: "取材・メディアについて", dedicated: true, route: "sales@example.com" },
  { id: "F14-08", category: "その他", dedicated: true, route: "sales@example.com" },
  { id: "F14-09", category: "サービスについて", dedicated: false, route: "fallback@example.com" },
  { id: "F14-10", category: "採用について", dedicated: false, route: "fallback@example.com" },
  { id: "F14-11", category: "協業・パートナーについて", dedicated: false, route: "fallback@example.com" },
  { id: "F14-12", category: "取材・メディアについて", dedicated: false, route: "fallback@example.com" },
  { id: "F14-13", category: "その他", dedicated: false, route: "fallback@example.com" },
] as const;

for (const route of routingCases) {
  test(`${route.id}: MAIL-AUTO-03 ${route.category}を${route.dedicated ? "専用" : "共通"}宛先へ2通とも対応付ける`, async () => {
    const sent: EmailPayload[] = [];
    const env = route.dedicated
      ? configuredEnv
      : {
          NODE_ENV: "production",
          RESEND_API_KEY: "re_test_key",
          CONTACT_FROM: "JQIT Web <web@example.com>",
          CONTACT_TO: "fallback@example.com",
        };

    const result = await processContactSubmission(
      makeFormData({ category: route.category }),
      env,
      async (payload) => {
        sent.push(payload);
      },
    );

    assert.deepEqual(result, { status: "success", fieldErrors: {} });
    assert.deepEqual(
      sent.map(({ to, replyTo }) => ({ to, replyTo })),
      [
        { to: route.route, replyTo: "taro@example.com" },
        { to: "taro@example.com", replyTo: route.route },
      ],
    );
  });
}

test("F14-14: MAIL-AUTO-01/02/07 有効送信は社内通知完了後に完全な受付メールを送る", async () => {
  const sent: EmailPayload[] = [];
  const events: string[] = [];

  const result = await processContactSubmission(
    makeFormData(),
    configuredEnv,
    async (payload) => {
      events.push(`start:${payload.to}`);
      sent.push(payload);
      await Promise.resolve();
      events.push(`end:${payload.to}`);
    },
    undefined,
    fixedNow,
  );

  assert.deepEqual(result, { status: "success", fieldErrors: {} });
  assert.deepEqual(events, [
    "start:sales@example.com",
    "end:sales@example.com",
    "start:taro@example.com",
    "end:taro@example.com",
  ]);
  assert.deepEqual(sent, [
    {
      from: "JQIT Web <web@example.com>",
      to: "sales@example.com",
      replyTo: "taro@example.com",
      subject: "【Webお問い合わせ】サービスについて",
      text: [
        "お問い合わせ日時: 2026年08月02日 12:04（日本時間）",
        "お名前: 山田 太郎",
        "会社名: 株式会社サンプル",
        "メール: taro@example.com",
        "電話番号: 03-1234-5678",
        "種別: サービスについて",
        "",
        "導入について相談したいです",
      ].join("\n"),
    },
    {
      from: "JQIT Web <web@example.com>",
      to: "taro@example.com",
      replyTo: "sales@example.com",
      subject: "【株式会社JQIT】お問い合わせを受け付けました",
      text: receiptText,
    },
  ]);
});

test("F14-15: MAIL-AUTO-01 省略可能な会社名と電話番号は社内通知でハイフン表示する", async () => {
  const sent: EmailPayload[] = [];

  await processContactSubmission(
    makeFormData({ company: "", tel: "" }),
    configuredEnv,
    async (payload) => {
      sent.push(payload);
    },
  );

  assert.match(
    sent[0]?.text ?? "",
    /^お問い合わせ日時: \d{4}年\d{2}月\d{2}日 \d{2}:\d{2}（日本時間）\nお名前: 山田 太郎\n会社名: -\nメール: taro@example\.com\n電話番号: -\n/,
  );
  assert.equal(sent.length, 2);
});

const attackMarkerCases = [
  { id: "F14-16", field: "name", marker: "NAME_ATTACK\r\nBcc:evil@example.com" },
  { id: "F14-17", field: "company", marker: "COMPANY_ATTACK_MARKER" },
  { id: "F14-18", field: "email", marker: "email-attack-marker@example.com" },
  { id: "F14-19", field: "tel", marker: "TEL_ATTACK_MARKER" },
  { id: "F14-20", field: "message", marker: "MESSAGE_ATTACK_MARKER" },
] as const;

for (const attack of attackMarkerCases) {
  test(`${attack.id}: MAIL-AUTO-02 ${attack.field}は受付内容へ記載するが件名へ反映しない`, async () => {
    const sent: EmailPayload[] = [];

    await processContactSubmission(
      makeFormData({ [attack.field]: attack.marker }),
      configuredEnv,
      async (payload) => {
        sent.push(payload);
      },
    );

    assert.deepEqual(
      {
        count: sent.length,
        internalIncludesMarker: sent[0]?.text.includes(attack.marker),
        receiptIncludesMarker:
          `${sent[1]?.subject}\n${sent[1]?.text}`.includes(attack.marker),
        subjectIncludesMarker: sent.some(({ subject }) =>
          subject.includes(attack.marker),
        ),
      },
      {
        count: 2,
        internalIncludesMarker: true,
        receiptIncludesMarker: true,
        subjectIncludesMarker: false,
      },
    );
  });
}

test("F14-21: MAIL-AUTO-04 社内通知失敗は受付メールを送らず固定ログとフォームエラーを返す", async () => {
  const attempts: EmailPayload[] = [];
  const errors: unknown[][] = [];

  const result = await processContactSubmission(
    makeFormData({ name: "NAME_INTERNAL_SECRET", message: "MESSAGE_INTERNAL_SECRET" }),
    configuredEnv,
    async (payload) => {
      attempts.push(payload);
      throw new Error("provider-internal-secret");
    },
    {
      error: (...args) => errors.push(args),
      log: () => undefined,
    },
  );

  assert.deepEqual({ result, attemptSubjects: attempts.map(({ subject }) => subject), errors }, {
    result: {
      status: "error",
      fieldErrors: {},
      formError:
        "送信に失敗しました。時間をおいて再度お試しいただくか、お電話にてご連絡ください。",
    },
    attemptSubjects: ["【Webお問い合わせ】サービスについて"],
    errors: [["[contact] 社内通知メールの送信に失敗しました"]],
  });
  assert.equal(JSON.stringify(errors).includes("secret"), false);
});

test("F14-22: MAIL-AUTO-05 受付メールだけ失敗した場合は再送防止のため成功を返す", async () => {
  const attempts: EmailPayload[] = [];
  const errors: unknown[][] = [];

  const result = await processContactSubmission(
    makeFormData({ name: "NAME_RECEIPT_SECRET", message: "MESSAGE_RECEIPT_SECRET" }),
    configuredEnv,
    async (payload) => {
      attempts.push(payload);
      if (attempts.length === 2) throw new Error("provider-receipt-secret");
    },
    {
      error: (...args) => errors.push(args),
      log: () => undefined,
    },
  );

  assert.deepEqual({ result, attemptSubjects: attempts.map(({ subject }) => subject), errors }, {
    result: { status: "success", fieldErrors: {} },
    attemptSubjects: [
      "【Webお問い合わせ】サービスについて",
      "【株式会社JQIT】お問い合わせを受け付けました",
    ],
    errors: [["[contact] 受付メールの送信に失敗しました（社内通知は送信済み）"]],
  });
  assert.equal(JSON.stringify(errors).includes("secret"), false);
});
