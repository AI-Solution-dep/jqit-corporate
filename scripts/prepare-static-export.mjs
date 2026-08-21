/**
 * GitHub Pages（静的エクスポート）向けのビルド前処理。CI 上でのみ実行し、コミットはしない。
 * - お問い合わせページを Server Actions 不使用の静的版に差し替え
 * - ニュース・コラム・実績の各ページから ISR（revalidate）を除去し、
 *   詳細ページを事前生成のみに固定
 *
 * 使い方: node scripts/prepare-static-export.mjs && STATIC_EXPORT=1 npm run build
 */
import fs from "node:fs";

// 1) お問い合わせページを静的版に差し替え（フォーム＝Server Actions は export 不可）
fs.copyFileSync("static-export/contact-page.tsx", "app/contact/page.tsx");
console.log("[static-export] app/contact/page.tsx を静的版に差し替え");

// 2) ISR を除去（output: export では revalidate が使えない）
// CMS から一覧を引くページを追加したら、ここにも足すこと。
const isrPages = [
  "app/news/page.tsx",
  "app/news/[id]/page.tsx",
  "app/column/page.tsx",
  "app/column/[id]/page.tsx",
  "app/works/page.tsx",
  "app/works/[id]/page.tsx",
];
for (const file of isrPages) {
  let src = fs.readFileSync(file, "utf8");
  const next = src.replace(/export const revalidate = \d+;\n\n?/g, "");
  if (next !== src) {
    fs.writeFileSync(file, next);
    console.log(`[static-export] ${file} から revalidate を除去`);
  }
}

// 3) 詳細ページは generateStaticParams の分のみ生成（未知IDの動的生成を無効化）
for (const detail of [
  "app/news/[id]/page.tsx",
  "app/column/[id]/page.tsx",
  "app/works/[id]/page.tsx",
]) {
  let src = fs.readFileSync(detail, "utf8");
  if (!src.includes("export const dynamicParams")) {
    src = src.replace(
      "type Props = ",
      "export const dynamicParams = false;\n\ntype Props = ",
    );
    fs.writeFileSync(detail, src);
    console.log(`[static-export] ${detail} に dynamicParams = false を追加`);
  }
}
