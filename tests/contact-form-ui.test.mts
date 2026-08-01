import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const formFiles = [
  "components/contact/ContactForm.tsx",
  "components/contact/StaticContactForm.tsx",
];

for (const [index, file] of formFiles.entries()) {
  test(`F13-0${index + 4}: ${file} は下書きとモバイル操作性を維持する`, () => {
    const source = readFileSync(file, "utf8");

    assert.match(source, /connectContactDraft/);
    assert.match(source, /clearContactDraft/);
    assert.match(source, /ref=\{formRef\}/);
    assert.match(source, /target="_blank"/);
    assert.match(source, /text-base/);
    assert.match(source, /min-h-12/);
    assert.match(source, /min-\[600px\]:w-auto/);
  });
}

test("F13-06: ContactForm は共有上限値を全テキスト入力へ適用する", () => {
  const source = readFileSync("components/contact/ContactForm.tsx", "utf8");

  assert.match(source, /contactFieldLimits/);
  for (const field of ["name", "company", "email", "tel", "message"]) {
    assert.match(source, new RegExp(`maxLength=\\{contactFieldLimits\\.${field}\\}`));
  }
});

test("F13-07: ContactForm の website honeypot は視覚・アクセシビリティツリー・タブ順から隠す", () => {
  const source = readFileSync("components/contact/ContactForm.tsx", "utf8");
  const websiteInput = source.match(/<input[\s\S]*?name="website"[\s\S]*?\/>/)?.[0];

  assert.notEqual(websiteInput, undefined);
  assert.match(websiteInput ?? "", /\shidden(?:\s|\/>)/);
  assert.match(websiteInput ?? "", /aria-hidden="true"/);
  assert.match(websiteInput ?? "", /tabIndex=\{-1\}/);
  assert.match(websiteInput ?? "", /autoComplete="off"/);
});

test("F13-08: ContactForm のクライアント共有モジュールは Zod に依存しない", () => {
  const formSource = readFileSync("components/contact/ContactForm.tsx", "utf8");
  const sharedSource = readFileSync("lib/contact.ts", "utf8");

  assert.match(formSource, /from "@\/lib\/contact"/);
  assert.doesNotMatch(formSource, /contact-submission|from "zod"/);
  assert.doesNotMatch(sharedSource, /from "zod"|contactSchema/);
});
