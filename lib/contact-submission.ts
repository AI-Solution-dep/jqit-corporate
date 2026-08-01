import { z } from "zod";
import {
  contactCategories,
  contactFieldLimits,
  type ContactField,
  type ContactFormState,
} from "#contact";
import { siteConfig } from "#site-config";

export const contactSchema = z.object({
  name: z
    .string({ error: "お名前は文字列で入力してください" })
    .trim()
    .min(1, "お名前を入力してください")
    .max(
      contactFieldLimits.name,
      `お名前は${contactFieldLimits.name}文字以内で入力してください`,
    ),
  company: z
    .string({ error: "会社名は文字列で入力してください" })
    .trim()
    .max(
      contactFieldLimits.company,
      `会社名は${contactFieldLimits.company}文字以内で入力してください`,
    )
    .optional(),
  email: z
    .string({ error: "メールアドレスは文字列で入力してください" })
    .trim()
    .min(1, "メールアドレスを入力してください")
    .max(
      contactFieldLimits.email,
      `メールアドレスは${contactFieldLimits.email}文字以内で入力してください`,
    )
    .email("メールアドレスの形式が正しくありません"),
  tel: z
    .string({ error: "電話番号は文字列で入力してください" })
    .trim()
    .max(
      contactFieldLimits.tel,
      `電話番号は${contactFieldLimits.tel}文字以内で入力してください`,
    )
    .optional(),
  category: z.enum(contactCategories, {
    message: "お問い合わせ種別を選択してください",
  }),
  message: z
    .string({ error: "お問い合わせ内容は文字列で入力してください" })
    .trim()
    .min(1, "お問い合わせ内容を入力してください")
    .max(
      contactFieldLimits.message,
      `お問い合わせ内容は${contactFieldLimits.message}文字以内で入力してください`,
    ),
  privacy: z.literal("on", {
    message: "プライバシーポリシーへの同意が必要です",
  }),
});

export type ContactEnvironment = Readonly<Record<string, string | undefined>>;

export type ContactEmailPayload = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export type SendContactEmail = (payload: ContactEmailPayload) => Promise<void>;

export type ContactSubmissionLogger = {
  error: (...args: unknown[]) => void;
  log: (...args: unknown[]) => void;
};

const defaultContactSender = "JQIT Corporate <onboarding@resend.dev>";

type ContactData = z.infer<typeof contactSchema>;

function formatContactDate(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.year}年${parts.month}月${parts.day}日 ${parts.hour}:${parts.minute}`;
}

function buildReceiptText(data: ContactData, submittedAt: string): string {
  return [
    "お問い合わせいただいたお客様へ",
    "",
    `この度は、${siteConfig.name}へお問い合わせいただき、誠にありがとうございます。`,
    "以下の内容でお問い合わせを受け付けました。",
    "",
    "■ お問い合わせ日時",
    `${submittedAt}（日本時間）`,
    "",
    "■ お名前",
    data.name,
    "",
    "■ 会社名",
    data.company || "-",
    "",
    "■ メールアドレス",
    data.email,
    "",
    "■ 電話番号",
    data.tel || "-",
    "",
    "■ お問い合わせ種別",
    data.category,
    "",
    "■ お問い合わせ内容",
    data.message,
    "",
    "担当者が内容を確認のうえ、原則2〜3営業日以内にご連絡いたします。",
    "お問い合わせ内容によっては、回答までお時間をいただく場合があります。あらかじめご了承ください。",
    "",
    "このメールは、お問い合わせの受付をお知らせする自動送信メールです。",
    "本メールにお心当たりがない場合は、お手数ですが破棄してください。",
    "",
    "──────────────────",
    siteConfig.name,
    ...siteConfig.addressLines,
    `TEL: ${siteConfig.tel}`,
    `営業時間: ${siteConfig.businessHours}`,
    siteConfig.url,
    "──────────────────",
  ].join("\n");
}

export function getContactRecipients(
  category: (typeof contactCategories)[number],
  env: ContactEnvironment = process.env,
) {
  const fallback = env.CONTACT_TO;
  const sales = env.CONTACT_TO_SALES ?? fallback;
  switch (category) {
    case "サービスについて":
    case "協業・パートナーについて":
    case "取材・メディアについて":
    case "その他":
      return sales;
    case "採用について":
      return env.CONTACT_TO_RECRUIT ?? fallback;
  }
}

export function isContactHoneypotTriggered(value: unknown): boolean {
  return typeof value !== "string" || value.length > 0;
}

export async function processContactSubmission(
  formData: FormData,
  env: ContactEnvironment,
  sendEmail: SendContactEmail,
  logger: ContactSubmissionLogger = console,
  getCurrentDate: () => Date = () => new Date(),
): Promise<ContactFormState> {
  if (isContactHoneypotTriggered(formData.get("website") ?? "")) {
    return { status: "success", fieldErrors: {} };
  }

  const raw = {
    name: formData.get("name") ?? "",
    company: formData.get("company") ?? "",
    email: formData.get("email") ?? "",
    tel: formData.get("tel") ?? "",
    category: formData.get("category") ?? "",
    message: formData.get("message") ?? "",
    privacy: formData.get("privacy") ?? "",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && key in contactSchema.shape) {
        const field = key as ContactField;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
    }
    return { status: "error", fieldErrors };
  }

  const data = parsed.data;
  const submittedAt = formatContactDate(getCurrentDate());
  const internalText = [
    `お問い合わせ日時: ${submittedAt}（日本時間）`,
    `お名前: ${data.name}`,
    `会社名: ${data.company || "-"}`,
    `メール: ${data.email}`,
    `電話番号: ${data.tel || "-"}`,
    `種別: ${data.category}`,
    "",
    data.message,
  ].join("\n");
  const apiKey = env.RESEND_API_KEY;
  const to = getContactRecipients(data.category, env);

  if (apiKey && to) {
    const from = env.CONTACT_FROM ?? defaultContactSender;
    try {
      await sendEmail({
        from,
        to,
        replyTo: data.email,
        subject: `【Webお問い合わせ】${data.category}`,
        text: internalText,
      });
    } catch {
      logger.error("[contact] 社内通知メールの送信に失敗しました");
      return {
        status: "error",
        fieldErrors: {},
        formError:
          "送信に失敗しました。時間をおいて再度お試しいただくか、お電話にてご連絡ください。",
      };
    }

    try {
      await sendEmail({
        from,
        to: data.email,
        replyTo: to,
        subject: `【${siteConfig.name}】お問い合わせを受け付けました`,
        text: buildReceiptText(data, submittedAt),
      });
    } catch {
      logger.error(
        "[contact] 受付メールの送信に失敗しました（社内通知は送信済み）",
      );
    }
  } else if (env.NODE_ENV === "production") {
    logger.error(
      "[contact] RESEND_API_KEY/CONTACT_TO が未設定のため送信できません（内容は記録していません）",
    );
    return {
      status: "error",
      fieldErrors: {},
      formError: `現在フォームを利用できません。お手数ですが TEL ${siteConfig.tel}（${siteConfig.businessHours}）までご連絡ください。`,
    };
  } else {
    logger.log("[contact] メール未接続のため送信を省略しました");
  }

  return { status: "success", fieldErrors: {} };
}
