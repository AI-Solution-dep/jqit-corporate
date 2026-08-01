export const contactCategories = [
  "サービスについて",
  "採用について",
  "協業・パートナーについて",
  "取材・メディアについて",
  "その他",
] as const;

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
