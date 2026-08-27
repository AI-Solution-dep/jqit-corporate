# Corporate — JQIT コーポレートサイト

Next.js App Router + microCMS + Vercel。本番は https://www.jqit.co.jp

## SEO / LLMO

施策と効果は **[SEO・LLMO 施策台帳](https://claude.ai/code/artifact/1c457472-e560-4d89-829b-1cac65c696de)** に集約している。
何をやって何が効いたか、比較基準になるベースライン値、やらないと決めたことと
その理由がここにある。**施策を打つ前後で必ず読み、実施したら更新する。**

技術的な詳細メモは `docs/plans/2026-08-25-seo-aio-backlog.md`（git 管理外）。

営業・非エンジニア向けの数字の読み方は
[こちらの共有ページ](https://claude.ai/code/artifact/8a038f05-1de8-4ac4-ad26-f9334ea31bce)。

### 計測データの取り方

GA4 も Search Console も **コネクタ不要**。gcloud の ADC でそのまま API を叩ける。

```bash
TOKEN=$(gcloud auth application-default print-access-token)
```

`x-goog-user-project: claude-secretary-mcp` ヘッダが必要。

| 対象 | ID / エンドポイント |
|---|---|
| GA4 コーポレートサイト | プロパティ `549595559` |
| GA4 データ取得 | `analyticsdata.googleapis.com/v1beta/properties/{id}:runReport` |
| GA4 ユーザー管理 | `analyticsadmin.googleapis.com/v1alpha/{parent}/accessBindings` |
| Search Console | `searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/...` |
| URL 検査 | `searchconsole.googleapis.com/v1/urlInspection/index:inspect` |

**GA4 の履歴は 2026年8月から。** それ以前との比較はできない。当面の効果測定は
Search Console 側を見る。

**Search Console のユーザー管理には API が無い。** 権限の追加・削除は管理画面のみ。

## 公開前ゲート（重要）

未公開ページは次の **3点セット** で伏せる運用になっている。

1. `robots: { index: false, follow: false }`
2. `lib/site-config.ts` の `globalNav` / `footerNav` に載せない
3. `app/sitemap.ts` に載せない

**sitemap やナビからページが抜けているのを見ても、それだけで「バグ」と判断しない。**
必ず該当ページの `robots` 指定とソース冒頭のコメントを確認する。公開するときは
3点を揃えて解除し、公開の可否そのものはユーザーに確認する（顧客との公開合意が
絡むため）。入稿・公開の手順は `microcms-article-publish` スキルの範囲。

## microCMS

エンドポイントは `news` / `column` / `works`。API キーが無い環境では
`lib/works-fallback.ts` などのサンプルデータが表示される（`isSample: true`）。

`app/sitemap.ts` には `revalidate = 3600` が必要。これが無いと記事を公開しても
再デプロイまで sitemap が古いままになる。

## SEO 実装の置き場

| 対象 | 場所 |
|---|---|
| メタデータ生成 | `lib/seo.ts` の `createPageMetadata` |
| 構造化データ | `components/seo/JsonLd.tsx`、各ページで `@graph` を組む |
| Organization / WebSite | `app/layout.tsx`（全ページ共通） |
| FAQ | `components/seo/ServiceFaq.tsx`（事業2ページで計23問） |
| 記事→事業ページの内部リンク | `lib/business-links.ts`（タグ・サービス種別で出し分け） |
| ニュース個別の SEO 上書き | `lib/news-seo-overrides.ts` |

会社情報・外部URL・ナビ定義はすべて `lib/site-config.ts` に集約する。
認証や従業員数などの実データは構造化データ側にも反映済み。
