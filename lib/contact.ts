export const contactCategories = [
  "サービスについて",
  "採用について",
  "協業・パートナーについて",
  "取材・メディアについて",
  "営業のご提案・サービス紹介",
  "その他",
] as const;

/**
 * GA4 の generate_lead に付ける種別キー。
 * 営業・採用の連絡と見込み客の問い合わせを分けて集計するために送る。
 * 表示文言を変えても集計が途切れないよう、英字の固定値にしている。
 */
export const contactCategoryAnalyticsKeys = {
  "サービスについて": "service",
  "採用について": "recruitment",
  "協業・パートナーについて": "partnership",
  "取材・メディアについて": "media",
  "営業のご提案・サービス紹介": "sales_pitch",
  "その他": "other",
} as const satisfies Record<(typeof contactCategories)[number], string>;

export function contactCategoryAnalyticsKey(category: string): string {
  return (
    (contactCategoryAnalyticsKeys as Record<string, string>)[category] ?? "unknown"
  );
}

/**
 * 営業・売り込みの連絡が誤って選ばれやすい種別。
 * 選択時に「営業のご提案・サービス紹介」への誘導を表示する。
 */
export const salesRedirectCategories = [
  "採用について",
  "協業・パートナーについて",
] as const satisfies readonly (typeof contactCategories)[number][];

export const salesRedirectNotice =
  "セールス・営業のご連絡は「営業のご提案・サービス紹介」を選択してご連絡いただきますようお願いいたします。";

export function shouldShowSalesRedirectNotice(category: string): boolean {
  return (salesRedirectCategories as readonly string[]).includes(category);
}

export const contactFieldLimits = {
  name: 100,
  company: 200,
  email: 254,
  tel: 30,
  message: 5000,
} as const;

export type ContactField =
  | "name"
  | "company"
  | "email"
  | "tel"
  | "category"
  | "message"
  | "privacy";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  fieldErrors: Partial<Record<ContactField, string>>;
  formError?: string;
};

export const initialContactState: ContactFormState = {
  status: "idle",
  fieldErrors: {},
};
