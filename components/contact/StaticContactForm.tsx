"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { clearContactDraft, connectContactDraft } from "@/lib/contact-draft";
import { siteConfig } from "@/lib/site-config";

/**
 * 静的エクスポート（GitHub Pages）用のお問い合わせフォーム。
 * 既存HP（WordPress）の Contact Form 7 REST API に直接送信するため、
 * サーバー不要で本番同様にメールが届く。フィールド構成・必須項目は
 * https://jqit.co.jp/contact/ のフォーム（ID: 169）に一致させている。
 * 既存HP廃止時はエンドポイントごと見直すこと。
 */
const CF7_ENDPOINT =
  "https://jqit.co.jp/wp-json/contact-form-7/v1/contact-forms/169/feedback";
const CF7_UNIT_TAG = "wpcf7-f169-p58-o1";

/** 既存HPフォームのセレクトフィールドと同じ選択肢 */
const categories = ["SI(受託・請負)事業について", "SES事業について", "その他"] as const;

type Field =
  | "category"
  | "your-name"
  | "your-name-kana"
  | "your-name-company"
  | "department"
  | "your-telephone"
  | "your-email"
  | "your-message"
  | "privacy";

const labels: Record<Exclude<Field, "privacy">, string> = {
  category: "お問い合わせ種別",
  "your-name": "お名前",
  "your-name-kana": "フリガナ",
  "your-name-company": "会社名",
  department: "部署",
  "your-telephone": "電話番号",
  "your-email": "メールアドレス",
  "your-message": "お問い合わせ内容",
};

const fieldCls =
  "min-h-12 w-full rounded-button border border-[#d8d5d0] bg-white px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-[#8a8781] focus:border-brand aria-[invalid=true]:border-brand";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs font-semibold text-brand">
      {message}
    </p>
  );
}

function validate(fd: FormData): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  const required: Exclude<Field, "privacy">[] = [
    "category",
    "your-name",
    "your-name-kana",
    "your-name-company",
    "department",
    "your-telephone",
    "your-email",
    "your-message",
  ];
  for (const f of required) {
    if (!String(fd.get(f) ?? "").trim()) {
      errors[f] = `${labels[f]}を入力してください`;
    }
  }
  const email = String(fd.get("your-email") ?? "");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors["your-email"] = "メールアドレスの形式が正しくありません";
  }
  if (fd.get("privacy") !== "on") {
    errors.privacy = "プライバシーポリシーへの同意が必要です";
  }
  return errors;
}

export function StaticContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    return connectContactDraft(formRef.current);
  }, []);

  useEffect(() => {
    if (status === "success") clearContactDraft();
  }, [status]);

  const errorId = (field: Field) => `${field}-error`;
  const a11y = (field: Field) =>
    fieldErrors[field]
      ? { "aria-invalid": true as const, "aria-describedby": errorId(field) }
      : {};

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const errors = validate(fd);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError(null);
      return;
    }

    setStatus("sending");
    setFieldErrors({});
    setFormError(null);

    try {
      fd.delete("privacy"); // CF7側に存在しない項目は送らない
      fd.append("_wpcf7_unit_tag", CF7_UNIT_TAG);
      const res = await fetch(CF7_ENDPOINT, { method: "POST", body: fd });
      const json: {
        status: string;
        message?: string;
        invalid_fields?: { field: string; message: string }[];
      } = await res.json();

      if (json.status === "mail_sent") {
        setStatus("success");
        return;
      }
      if (json.status === "validation_failed" && json.invalid_fields) {
        const errs: Partial<Record<Field, string>> = {};
        for (const f of json.invalid_fields) {
          errs[f.field as Field] = f.message;
        }
        setFieldErrors(errs);
        setStatus("idle");
        return;
      }
      throw new Error(json.message ?? "unknown");
    } catch {
      setFormError(
        `送信に失敗しました。お手数ですが、しばらく経ってから再度お試しいただくか、お電話（${siteConfig.tel}）にてお問い合わせください。`,
      );
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="border border-line bg-cream px-9 py-11 text-center">
        <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
          Thank you
        </p>
        <h3 className="palt text-2xl font-bold text-ink">送信が完了しました。</h3>
        <p className="mt-3.5 text-sm leading-[1.9] text-muted">
          お問い合わせありがとうございます。担当者より折り返しご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-6"
    >
      {formError && (
        <p
          role="alert"
          className="border border-brand bg-brand/5 px-4 py-3 text-sm font-semibold text-brand"
        >
          {formError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 min-[600px]:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="your-name" className="text-sm font-semibold leading-6 text-ink">
            お名前 <span className="text-brand">*</span>
          </label>
          <input
            id="your-name"
            name="your-name"
            type="text"
            placeholder="山田 太郎"
            className={fieldCls}
            {...a11y("your-name")}
          />
          <FieldError id={errorId("your-name")} message={fieldErrors["your-name"]} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="your-name-kana" className="text-sm font-semibold leading-6 text-ink">
            フリガナ <span className="text-brand">*</span>
          </label>
          <input
            id="your-name-kana"
            name="your-name-kana"
            type="text"
            placeholder="ヤマダ タロウ"
            className={fieldCls}
            {...a11y("your-name-kana")}
          />
          <FieldError
            id={errorId("your-name-kana")}
            message={fieldErrors["your-name-kana"]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[600px]:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="your-name-company"
            className="text-sm font-semibold leading-6 text-ink"
          >
            会社名 <span className="text-brand">*</span>
          </label>
          <input
            id="your-name-company"
            name="your-name-company"
            type="text"
            placeholder="株式会社〇〇"
            className={fieldCls}
            {...a11y("your-name-company")}
          />
          <FieldError
            id={errorId("your-name-company")}
            message={fieldErrors["your-name-company"]}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="department" className="text-sm font-semibold leading-6 text-ink">
            部署 <span className="text-brand">*</span>
          </label>
          <input
            id="department"
            name="department"
            type="text"
            placeholder="情報システム部"
            className={fieldCls}
            {...a11y("department")}
          />
          <FieldError id={errorId("department")} message={fieldErrors.department} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[600px]:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="your-email" className="text-sm font-semibold leading-6 text-ink">
            メールアドレス <span className="text-brand">*</span>
          </label>
          <input
            id="your-email"
            name="your-email"
            type="email"
            placeholder="name@example.com"
            className={fieldCls}
            {...a11y("your-email")}
          />
          <FieldError id={errorId("your-email")} message={fieldErrors["your-email"]} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="your-telephone" className="text-sm font-semibold leading-6 text-ink">
            電話番号 <span className="text-brand">*</span>
          </label>
          <input
            id="your-telephone"
            name="your-telephone"
            type="tel"
            placeholder="03-0000-0000"
            className={fieldCls}
            {...a11y("your-telephone")}
          />
          <FieldError
            id={errorId("your-telephone")}
            message={fieldErrors["your-telephone"]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-sm font-semibold leading-6 text-ink">
          お問い合わせ種別 <span className="text-brand">*</span>
        </label>
        <select
          id="category"
          name="category"
          defaultValue=""
          className={fieldCls}
          {...a11y("category")}
        >
          <option value="" disabled>
            選択してください
          </option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <FieldError id={errorId("category")} message={fieldErrors.category} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="your-message" className="text-sm font-semibold leading-6 text-ink">
          お問い合わせ内容 <span className="text-brand">*</span>
        </label>
        <textarea
          id="your-message"
          name="your-message"
          rows={6}
          placeholder="お問い合わせ内容をご記入ください"
          className={`${fieldCls} resize-y leading-[1.7]`}
          {...a11y("your-message")}
        />
        <FieldError id={errorId("your-message")} message={fieldErrors["your-message"]} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm leading-6 text-body">
          <input
            type="checkbox"
            name="privacy"
            className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
            {...a11y("privacy")}
          />
          <span>
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline underline-offset-2"
            >
              プライバシーポリシー
            </Link>
            に同意のうえ送信します。
          </span>
        </label>
        <FieldError id={errorId("privacy")} message={fieldErrors.privacy} />
      </div>

      <div className="mt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-button bg-brand px-9 py-[15px] text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60 min-[600px]:w-auto"
        >
          {status === "sending" ? "送信中…" : "送信する"}
          <span aria-hidden className="font-mono">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
