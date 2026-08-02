# JQIT コーポレートサイト

Next.js 16（App Router / Turbopack）+ TypeScript + Tailwind CSS v4 のコーポレートサイト。
デザインは claude.ai/design プロジェクト「JQIT コーポレートサイト制作」を原本とし、
フルゴシック（Noto Sans JP + Inter + JetBrains Mono、ロゴのみ Anton）のモダンテック路線。

## 開発

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 本番ビルド（型チェック含む）
npm run lint
```

## 環境変数

`.env.local.example` をコピーして `.env.local` を作成。**未設定でも全ページ動作します**
（ニュースはモックデータ、お問い合わせはサーバーログ記録にフォールバック）。

| 変数 | 用途 |
|---|---|
| `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` | ニュース配信（microCMS） |
| `RESEND_API_KEY` / `CONTACT_FROM` | お問い合わせメール送信（Resend） |
| `CONTACT_TO` / `CONTACT_TO_SALES` / `CONTACT_TO_RECRUIT` | お問い合わせ種別ごとの送信先 |

### microCMS スキーマ（エンドポイント: `news`）

| フィールドID | 種類 |
|---|---|
| `title` | テキストフィールド |
| `date` | 日時 |
| `category` | セレクト（お知らせ / プレス / 採用 / イベント） |
| `eyecatch` | 画像 |
| `gallery` | 複数画像 |
| `body` | リッチエディタ |

## 構成

- `app/` — ページ（トップ / about / contact / news / news/[id]）+ SEO（sitemap / robots / not-found）
- `components/ui/` — デザインシステムプリミティブ（Button / Kicker / FadeIn / CountUp / TechBackdrop 等）
- `components/layout/` — SiteHeader / SiteFooter / PageHeader
- `components/home/` — トップページの9セクション
- `lib/site-config.ts` — **外部URL・連絡先・会社情報の集約**（既存HP jqit.co.jp 由来の実データ反映済み）
- `lib/microcms.ts` — CMSクライアント（sanitize-html でサニタイズ、未接続時モックフォールバック）
- `public/jqit-logo.png` / `app/icon.png` / `public/nova-product.png` — 既存HPから流用した実アセット

## TODO

- [x] microCMS サービス作成・APIキー設定
- [ ] Resend 接続（お問い合わせメール送信）
- [ ] 写真（ヒーロー / 代表）を `ImagePlaceholder` から `next/image` に差し替え
- [x] プライバシーポリシーページ作成
- [x] 採用サイトを独自ドメイン（recruitment.jqit.co.jp）へ切り替え
- [ ] 本番デプロイ（現行 jqit.co.jp との切り替え計画）
