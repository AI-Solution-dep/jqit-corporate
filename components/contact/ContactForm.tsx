"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact } from "@/app/contact/actions";
import {
  contactCategories,
  contactFieldLimits,
  type ContactField,
  initialContactState,
  salesRedirectNotice,
  shouldShowSalesRedirectNotice,
} from "@/lib/contact";
import { clearContactDraft, connectContactDraft } from "@/lib/contact-draft";

const fieldCls =
  "min-h-12 w-full rounded-card border border-[#d8d5d0] bg-white px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-[#8a8781] focus:border-brand aria-[invalid=true]:border-brand";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs font-semibold text-brand">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialContactState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!formRef.current) return;
    const disconnect = connectContactDraft(formRef.current);
    // 下書き復元は DOM を直接書き換えるため、復元後の値を state に取り込む。
    setCategory(categoryRef.current?.value ?? "");
    return disconnect;
  }, []);

  useEffect(() => {
    if (state.status === "success") clearContactDraft();
  }, [state.status]);

  const errorId = (field: ContactField) => `${field}-error`;
  const a11y = (field: ContactField) =>
    state.fieldErrors[field]
      ? { "aria-invalid": true as const, "aria-describedby": errorId(field) }
      : {};

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border border-line bg-cream px-9 py-11 text-center"
      >
        <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
          Thank you
        </p>
        <h2 className="palt text-2xl font-bold text-ink">送信が完了しました。</h2>
        <p className="mt-3.5 text-sm leading-[1.9] text-muted">
          お問い合わせありがとうございます。担当者より折り返しご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="flex flex-col gap-6"
    >
      {state.formError && (
        <p
          role="alert"
          className="border border-brand bg-brand/5 px-4 py-3 text-sm font-semibold text-brand"
        >
          {state.formError}
        </p>
      )}

      <input
        name="website"
        type="text"
        hidden
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 gap-5 min-[600px]:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-semibold leading-6 text-ink">
            お名前 <span className="text-brand">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={contactFieldLimits.name}
            placeholder="山田 太郎"
            className={fieldCls}
            {...a11y("name")}
          />
          <FieldError id={errorId("name")} message={state.fieldErrors.name} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="company" className="text-sm font-semibold leading-6 text-ink">
            会社名
          </label>
          <input
            id="company"
            name="company"
            type="text"
            maxLength={contactFieldLimits.company}
            placeholder="株式会社〇〇"
            className={fieldCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[600px]:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold leading-6 text-ink">
            メールアドレス <span className="text-brand">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={contactFieldLimits.email}
            placeholder="name@example.com"
            className={fieldCls}
            {...a11y("email")}
          />
          <FieldError id={errorId("email")} message={state.fieldErrors.email} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="tel" className="text-sm font-semibold leading-6 text-ink">
            電話番号
          </label>
          <input
            id="tel"
            name="tel"
            type="tel"
            maxLength={contactFieldLimits.tel}
            placeholder="03-0000-0000"
            className={fieldCls}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-sm font-semibold leading-6 text-ink">
          お問い合わせ種別 <span className="text-brand">*</span>
        </label>
        <select
          ref={categoryRef}
          id="category"
          name="category"
          defaultValue=""
          onChange={(e) => setCategory(e.target.value)}
          className={fieldCls}
          {...a11y("category")}
        >
          <option value="" disabled>
            選択してください
          </option>
          {contactCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <FieldError id={errorId("category")} message={state.fieldErrors.category} />
        {shouldShowSalesRedirectNotice(category) && (
          <p
            role="status"
            className="text-xs font-semibold leading-[1.8] text-brand"
          >
            {salesRedirectNotice}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-semibold leading-6 text-ink">
          お問い合わせ内容 <span className="text-brand">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={contactFieldLimits.message}
          placeholder="お問い合わせ内容をご記入ください"
          className={`${fieldCls} resize-y leading-[1.7]`}
          {...a11y("message")}
        />
        <FieldError id={errorId("message")} message={state.fieldErrors.message} />
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
        <FieldError id={errorId("privacy")} message={state.fieldErrors.privacy} />
      </div>

      <div className="mt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-card bg-brand px-9 py-[15px] text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60 min-[600px]:w-auto"
        >
          {isPending ? "送信中…" : "送信する"}
          <span aria-hidden className="font-mono">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
