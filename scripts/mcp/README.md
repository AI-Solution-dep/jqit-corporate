# microCMS MCP 導入キット

このプロジェクトの microCMS（サービスID: `jqit-corporate`）に、Claude Code / Cursor から
直接つなぐための設定一式。

## 構成

| ファイル | 役割 | git |
|---|---|---|
| [`../../.mcp.json`](../../.mcp.json) | MCPサーバー2つの定義。**秘密情報は入っていない** | コミットする |
| [`microcms-mcp.sh`](./microcms-mcp.sh) | `.env.local` からキーを読み、環境変数名を詰め替えて起動するラッパー | コミットする |
| [`settings.local.example.json`](./settings.local.example.json) | 破壊的ツールを禁止する権限設定のひな形 | コミットする |
| `.claude/settings.local.json` | 上記をコピーした実ファイル | gitignore |
| `.env.local` | サービスID・APIキーの唯一の置き場 | gitignore |

サーバーは2つ。

- **`microcms-document`** — microCMS公式ドキュメントを参照するだけ。認証不要・副作用なし。
- **`microcms`** — 実サービスのコンテンツを読み書きする。**取得だけでなく作成・更新・削除・メディア操作のツールも公開される**（全22ツール）。

## セットアップ

1. `.env.local` に以下があることを確認する（`.env.local.example` 参照）。

   ```
   MICROCMS_SERVICE_DOMAIN=jqit-corporate
   MICROCMS_API_KEY=...
   ```

2. 権限設定をコピーする。

   ```bash
   cp scripts/mcp/settings.local.example.json .claude/settings.local.json
   ```

3. Claude Code を再起動する。プロジェクトの `.mcp.json` を使うか確認されるので承認する。

4. 疎通確認。

   ```
   microCMS の news から最新3件のタイトルを取得して
   ```

## APIキーの権限について

`.env.local` の `MICROCMS_API_KEY` はサイトのビルド用（GET中心）。
入稿・更新まで MCP にやらせる場合、**このサービスは無料プランのためAPIキーを1本しか作れない**
（Hobby: 1個 / Team: 3個 / Business: 10個）。MCP専用キーを別途発行する運用は取れないので、
既存キーの権限を絞って使う。

microCMS の権限には「サービス全体に効くデフォルト権限」と「API単位の個別権限」があり、
**個別権限がデフォルト権限を上書きする**。

- デフォルト権限 → `GET` のみ（現状のまま）
- 個別権限で、書き込ませたいエンドポイント（`column` など）にだけ `POST` / `PUT` / `PATCH` を追加
- `DELETE` はどこにも付けない

このキーがブラウザに露出していないことは確認済み。`NEXT_PUBLIC_` 接頭辞ではなく、
クライアントコンポーネントが `@/lib/microcms` から取っているのは型だけ、
`out/` 配下のJS 16個を走査してもキー文字列の混入なし（`output: "export"` の SSG のため
ビルド時にしか使われない）。したがって書き込み権限を足すリスクは、公式が警告する
CSR でのキー露出の状況には当たらない。

将来 Team 以上のプランに上げてキーを増やせるようになったら、MCP専用キーを発行して
`.env.local` に `MICROCMS_MCP_API_KEY` を足す（ラッパーがそちらを優先する）。

## 現在のAPIキーで何ができるか（実測 2026-08-21）

`.env.local` の `MICROCMS_API_KEY` はサイトビルド用で、**`news` の GET のみ**通る。

| 操作 | 結果 |
|---|---|
| `microcms_get_list` (`news`) | ✅ 200 / 31件 |
| `microcms_get_list` (`works`) | ⚠️ 404（エンドポイント未作成。`lib/works.ts` がサンプルにフォールバック中） |
| `microcms_get_media` | ❌ 403 |
| `microcms_get_list_meta` / `microcms_get_api_list`（マネジメントAPI） | ❌ 403 |
| 作成・更新・削除系 | 未検証（本番CMSを変更するため実行していない） |

入稿・メディア・メタ情報を MCP から扱うには、下記のとおり既存キーの権限設定を変更する必要がある。

## 安全策

`settings.local.example.json` で以下を設定済み。

- `microcms_delete_content` / `microcms_delete_media` は **deny**（実行不可）
- 公開系の作成・更新・メディアアップロードは **ask**（都度確認）
- 取得系のみ **allow**

下書き作成（`microcms_create_content_draft` / `microcms_update_content_draft`）は
allow にも ask にも入れていないため、通常の確認プロンプトが出る。
運用に慣れたら ask に移すとよい。

## トラブルシューティング

```bash
# ラッパー単体で起動確認（環境変数の解決を含む）
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"t","version":"1"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  | ./scripts/mcp/microcms-mcp.sh
```

`single-service mode (service: jqit-corporate)` と出れば正常。

- `.env.local が見つかりません` → `.env.local.example` を複製する
- ツール一覧は出るが取得で 401 → APIキーが失効しているか権限不足

## 参考

- [microCMS MCP Server](https://document.microcms.io/mcp-server/microcms-mcp-server)
- [microCMS Document MCP Server](https://document.microcms.io/mcp-server/microcms-document-mcp-server)
