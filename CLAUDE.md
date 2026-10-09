# JQIT コーポレートサイト — 開発ガイド

## 技術スタック

- **Next.js 16.2.12** — App Router。ビルド時に型チェック実行。
- **React 19.2.4** — コンポーネント実装
- **TypeScript 5.x** — `strict: true` で厳密型チェック
- **Tailwind CSS 4.x** (@tailwindcss/postcss) — PostCSS v8.5.25
- **microCMS SDK 3.4.0** — ニュース・実績・コラムのコンテンツ配信
- **Resend 6.16.0** — お問い合わせフォームのメール送信
- **sanitize-html 2.17.5** — CMS本文 HTML のサーバーサイドサニタイズ
- **zod 4.4.3** — スキーマ検証
- **ESLint 9.x** — Next.js Core Web Vitals + TypeScript ルール

## ファイル構成

```
app/                       # Next.js App Router
├── page.tsx               # トップページ
├── layout.tsx             # 全ページ共通（フォント読み込み、GA、JSON-LD）
├── news/, column/         # ニュース・コラム（一覧 + [id] 詳細）
├── contact/               # お問い合わせフォーム（Server Action: actions.ts）
├── about/, business/      # 会社情報、事業説明
├── privacy-policy/        # プライバシーポリシー等
└── [SEO] robots.ts, sitemap.ts, not-found.tsx

components/
├── ui/                    # デザインシステム（Button, FadeIn, CountUp等）
├── layout/                # SiteHeader, SiteFooter, PageHeader
├── seo/                   # GoogleAnalytics, JsonLd
├── home/                  # トップページセクション（BusinessSection等）
└── [各ページ]             # news/, contact/, column/ 等

lib/
├── site-config.ts         # 外部URL、連絡先、会社情報、ナビメニュー定義
├── contact.ts             # フォーム定義（カテゴリ、フィールド上限）
├── contact-draft.ts       # フォーム下書き保存（localStorage）
├── contact-submission.ts  # フォーム検証＋送信処理
├── microcms.ts            # CMS クライアント、サニタイズ、フォールバック
├── news-fallback.ts       # CMS未接続時のニュースモック
├── works.ts, column.ts    # 実績・コラム取得
├── seo.ts, analytics.ts   # SEOメタデータ、GA初期化
└── news-seo-overrides.ts  # ニュース固有SEO調整

scripts/
├── sync-microcms-news-images.mjs  # CMS画像キャッシュ同期
├── mcp/                   # Claude Code用 microCMS MCP設定
└── diagrams/              # 構成図

public/                    # 既存HP由来のアセット
├── jqit-logo.png, nova-product.png
├── badges/                # ISO、DX認定等ロゴ
└── news/                  # ニュース画像

tests/                     # node:test ユニットテスト
├── contact-*.test.mts     # フォーム検証、送信、セキュリティ
├── seo-*.test.mts         # メタデータ検証
└── [その他機能テスト]
```

## 実行コマンド

```bash
# 開発サーバー（http://localhost:3000）
npm run dev

# 本番ビルド（型チェック + SSG/ISR最適化）
npm run build

# 本番サーバー起動
npm start

# Lint（ESLint + TypeScript）
npm run lint

# microCMS 画像をローカルキャッシュに同期（ビルド前の前処理）
npm run cms:sync-news-images

# テスト（node:test。テストランナースクリプト未設定）
node --test tests/**/*.test.mts
```

## 環境変数（.env.local）

**未設定でも全ページが動作します**（CMS はモック、メール送信はコンソール出力）。

```bash
# microCMS（ニュース・実績・コラム配信）
MICROCMS_SERVICE_DOMAIN=jqit-corporate
MICROCMS_API_KEY=...

# Resend（お問い合わせメール送信）
RESEND_API_KEY=...
CONTACT_FROM=noreply@jqit.co.jp
CONTACT_TO=...
CONTACT_TO_SALES=...
CONTACT_TO_RECRUIT=...
```

## コード上の注目点

### lib/site-config.ts — 設定の集約

外部URL、電話番号、住所、CEO名、ナビメニュー（`globalNav`, `footerNav`）、認証バッジ情報など、複数ページで参照される情報を集約しています。

```typescript
export const siteConfig = {
  name: "株式会社JQIT",
  tel: "03-6433-5383",
  address: "〒150-0002 東京都渋谷区渋谷1-12-2 クロスオフィス渋谷609",
  // ... その他実データ
};
```

### lib/microcms.ts — CMS 接続＋サニタイズ＋フォールバック

3つの機能が1ファイルに統合：

1. **CMS接続**：microCMS SDK で news / works / column 取得
2. **サニタイズ**：`sanitizeHtml()` で CMS本文 HTML をサーバー側でサニタイズ
   - 許可タグ：`<img>`, `<figure>`, `<figcaption>` + 既定タグ
   - 許可属性：a タグに `rel="noopener noreferrer"` 強制付与（tabnabbing対策）
   - microCMS 画像は WebP 変換＋品質圧縮（`fm=webp&q=75&w=1200`）
3. **フォールバック**：CMS未接続時は `{endpoint}-fallback.ts` のモックで動作

```typescript
export async function getNewsList(queries?: MicroCMSQueries): Promise<News[]> {
  if (!client) return fallbackNews(queries?.limit);  // CMS未接続
  try {
    // microCMS 取得
  } catch (e) {
    // 404（未公開・削除済み）は log 出さず、それ以外は log → フォールバック
    return fallbackNews(queries?.limit);
  }
}
```

### app/contact/actions.ts — Server Action

フォーム送信処理をサーバー側で実行。レート制限は Vercel Firewall が担当（コメント：5回/600秒/IP）。

```typescript
export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // processContactSubmission で検証
  // sendEmail で Resend を呼び出し
}
```

### next.config.ts — セキュリティヘッダー

全ページに CSP（Content Security Policy）等を設定：

- `default-src 'self'` — 同一オリジンのみ許可
- `form-action 'self' https://portal.jqit.co.jp` — フォーム送信先
- `img-src 'self' data: https:` — 画像（microCMS、Google Fonts対応）
- `script-src 'self' 'unsafe-inline' https://portal.jqit.co.jp https://www.googletagmanager.com` — Google Tag Manager, Google Analytics
- `/portal/*` では `X-Frame-Options: ALLOWALL`, `frame-ancestors 'self' https://www.jqit.co.jp`（WordPress iframe対応）

リダイレクト・リライト設定も含む：
- `/company` → `/about` 等（旧 WordPress URL の移行）
- `/portal/*` → `https://portal.jqit.co.jp/*`（ポータルサイトのプロキシ）

### app/layout.tsx — フォント定義

Google Fonts から 4書体を読み込み、CSS変数で提供：

```typescript
const notoSansJp = Noto_Sans_JP({ variable: "--font-noto-sans-jp" });
const inter = Inter({ variable: "--font-inter" });
const jetBrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono" });
const anton = Anton({ variable: "--font-anton-face" });  // ロゴのみ
```

Tailwind CSS で各コンポーネントがこれらを参照します。

### lib/news-fallback.ts, lib/works-fallback.ts

microCMS が接続されていない場合のモックデータ。開発・テスト時に活用。

### tests/ — node:test ユニットテスト

node:assert + node:test で実装。`npm run lint` スクリプトはありますが、`npm test` スクリプトはありません。テスト実行は以下で手動：

```bash
node --test tests/**/*.test.mts
```

テスト内容：
- フォーム検証（CSRF, XSS, フィールド制限）
- CMS 下書き保存
- ニュース・コラム公開状態
- SEOメタデータ（OGP, canonical, JSON-LD）
- ポータル proxy ルーティング

### .mcp.json — Claude Code から microCMS を操作

2つの MCP サーバーを定義（秘密情報は含まない）：

```json
{
  "microcms-document": "microCMS 公式ドキュメント参照（読み取りのみ）",
  "microcms": "./scripts/mcp/microcms-mcp.sh"  // ラッパースクリプト
}
```

`scripts/mcp/microcms-mcp.sh` が `.env.local` から `MICROCMS_API_KEY` を読み込み、環境変数で MCP サーバーを起動します。

詳細は `scripts/mcp/README.md` を参照。

### .gitignore — 秘密情報の除外

```
.env*          # 環境変数（CMS APIキー、Resend APIキー等）
/.claude/      # Claude Code セッション
/docs/         # 設計資料（サードパーティ画像）
```

---

## 確認が必要な項目

以下については、チーム内で明確にしておくと、新規参加者や保守時に有用です：

- **本番環境への環境変数設定方法** — Vercel UI での設定か、別の自動化があるのか
- **site-config.ts の実データ更新フロー** — 電話番号・住所・CEO名は既存HP（jqit.co.jp）と同期する必要があるのか、担当者は誰か
- **public/ アセットの著作権・ライセンス管理** — jqit-logo.png, nova-product.png 等の更新・削除権限は誰にあるのか
- **microCMS 入稿権限** — MCP の 22 ツール（読み書き削除）を誰が操作できるのか、入稿・レビュー・承認フロー
- **お問い合わせメール送信先** — CONTACT_TO_SALES, CONTACT_TO_RECRUIT は複数メールアドレス（カンマ区切り等）に対応するのか、1アドレスのみか
- **CI/CD でのテスト実行** — `node --test` が push時に強制されるのか、デプロイ前チェックなのか
- **既存HP（jqit.co.jp）の切り替え予定** — next.config.ts のリダイレクト・リライトいつまで保つのか
- **CSP / サニタイズ許可リストの更新時の判断基準** — 新しい HTML タグ・属性やセキュリティヘッダーの追加時、誰がレビューするのか
