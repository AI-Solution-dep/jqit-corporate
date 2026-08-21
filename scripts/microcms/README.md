# microCMS エンドポイント定義

コード側が期待するフィールドの一覧。microCMS 管理画面でAPIを作る際は、
**fieldId を完全に一致させる**こと（表示名は変えてよい）。

エンドポイントの新規作成はAPIからは行えない（マネジメントAPIにもAPI作成の口は無く、
スキーマは取得のみ）。管理画面で作成する。作成後の入稿・更新はAPI／MCP経由で行える。

## エンドポイントの作り方

管理画面（https://<サービスID>.microcms.io）左メニューの「コンテンツ（API）」の
**［＋］** から作成する。手順は3ステップ。

1. **API名とエンドポイント**を入力
   - works: API名「実績」／エンドポイント `works`
   - column: API名「技術コラム」／エンドポイント `column`
   - エンドポイントは3〜32文字の半角英小文字（作成後の変更は既存URLを404にするので注意）
2. **APIの型**で「リスト形式」を選ぶ
3. **APIスキーマを定義**の画面で「ファイルインポートする場合はこちらから」を選び、
   このディレクトリの JSON を読み込む
   - `schema-works.json`
   - `schema-column.json`

インポートが使えない場合（権限やプランによる）は、下の表のとおり手で追加する。
**fieldId を完全に一致させる**こと。

`schema-works.json` の `metrics`（繰り返しフィールド）でインポートが弾かれた場合は、
そのフィールドだけ JSON から削除して取り込み、あとから管理画面で追加すればよい。

## news（作成済み）

実装: `lib/microcms.ts`

## works（要作成 / API種別: リスト形式）

実装: `lib/works.ts` ／ 表示: `/works`

| fieldId | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| `title` | タイトル | テキストフィールド | ✓ | 実績の見出し |
| `date` | 実施日 | 日時 | ✓ | 並び順の基準。プロジェクト完了月でよい |
| `clientName` | 顧客名（実名） | テキストフィールド | | **社名公開の許諾が取れている場合のみ入力** |
| `clientAlias` | 顧客名（匿名表記） | テキストフィールド | | 例「大手製造業A社」 |
| `industry` | 業種 | セレクトフィールド | | 製造 / 小売 / 金融 / 公共 / 医療 / IT / その他 |
| `serviceType` | 提供サービス | セレクトフィールド | | 受託開発 / SES / システムテスト・QA / AI導入支援 / AIエージェント開発 |
| `period` | 期間 | テキストフィールド | | 例「2025.04 - 2025.12」 |
| `scale` | 体制 | テキストフィールド | | 例「6名 / 9ヶ月」 |
| `summary` | 要約 | テキストエリア | | 一覧カードに出る1〜2文 |
| `challenge` | 課題 | リッチエディタ | | |
| `approach` | 打ち手 | リッチエディタ | | |
| `result` | 成果 | リッチエディタ | | |
| `metrics` | 指標 | 繰り返しフィールド | | カスタムフィールド `label`（テキスト）+ `value`（テキスト） |
| `techStack` | 技術スタック | テキストフィールド | | カンマ・読点・スラッシュ区切り |
| `eyecatch` | アイキャッチ | 画像 | | 一覧カード・OGP兼用 |
| `body` | 補足 | リッチエディタ | | 任意 |

**社名公開の運用ルール**: `clientName` があれば実名、なければ `clientAlias`、
どちらも無ければ業種から自動生成（「製造のお客様」）。実名は許諾が取れたものだけ
入力することで、うっかり公開を構造的に防ぐ。

## column（要作成 / API種別: リスト形式）

実装: `lib/column.ts` ／ 表示: `/column`

| fieldId | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| `title` | タイトル | テキストフィールド | ✓ | |
| `date` | 公開日 | 日時 | ✓ | 並び順の基準 |
| `tags` | タグ | テキストフィールド | | カンマ・読点・スラッシュ区切り。例「Playwright, テスト自動化」 |
| `excerpt` | 要約 | テキストエリア | | 一覧カードと記事冒頭に出る1〜2文 |
| `authorName` | 執筆者 | テキストフィールド | | 未入力なら社名名義 |
| `authorRole` | 執筆者の肩書 | テキストフィールド | | |
| `eyecatch` | アイキャッチ | 画像 | | 一覧カード・OGP兼用 |
| `body` | 本文 | リッチエディタ | ✓ | |
| `qiitaUrl` | Qiita転載先URL | テキストフィールド | | 入力すると記事末尾に相互リンクが出る。https のみ有効 |

**運用ルール**: HP に先に公開 → Search Console でインデックス登録 →
Qiita へ転載（冒頭に初出リンク）→ `qiitaUrl` を埋めて相互リンクを張る。

## 公開前ゲート

`/works` と `/column` はどちらも**公開前ページ**として実装してある。
noindex かつナビ・サイトマップ未掲載で、`tests/works-unlisted.test.mts` /
`tests/column-unlisted.test.mts` がそれを保証している。

コンテンツが入って公開判断ができたら、各ページ冒頭のコメントにある手順
（robots 削除 → `lib/site-config.ts` のナビ追加 → `app/sitemap.ts` 追加 →
テスト更新）を実施する。

## Qiita 記事の取り込み

`import-qiita-column.mjs` が Qiita の記事を `column` エンドポイントへ投入する。

```bash
# 下見（microCMS には書き込まない。.qiita-import/ にHTMLとJSONを出す）
node scripts/microcms/import-qiita-column.mjs

# 下書きとして投入
node scripts/microcms/import-qiita-column.mjs --apply

# 一部だけ／除外して投入
node scripts/microcms/import-qiita-column.mjs --apply --only 8f165276859a777c6108
node scripts/microcms/import-qiita-column.mjs --apply --exclude 897573d03839f82e1ae3
```

- 本文は Qiita の `rendered_body`（HTML）を整形して使う。Markdown を変換し直すより
  Qiita 側の表示に忠実で崩れにくい。
- 画像は Qiita の CDN を直リンクせず `public/column/<slug>/` へ複製し、WebP に変換する
  （外部ホストへの依存を残さないため）。**下見モードでも画像は保存される。**
- URL のスラッグは `qiita-column-slugs.json` で Qiita 記事ID → スラッグを定義する。
  未定義の記事は Qiita の記事IDがそのまま URL になる。
- 投入は既定で**下書き**。公開状態で入れる場合のみ `--publish` を付ける。

取り込み後に手を入れる前提の項目:

| 項目 | 理由 |
|---|---|
| `excerpt` | 本文の最初の段落から自動生成しているだけなので、一覧カードとメタディスクリプションに耐える文へ書き直す |
| `eyecatch` | Qiita には無いので未設定。一覧の見栄えに効くため設定したい |
| `authorName` / `authorRole` | 未設定だと社名名義になる |
