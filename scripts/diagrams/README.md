# 実績ページの構成図

顧客システムの画面は公開許諾が無いため、実績のアイキャッチには
「何をどう作ったか」を示す構成図を使う。ここに SVG のソースを置き、
WebP に書き出したものを `public/works/` に配置する。

```bash
node -e "require('sharp')('scripts/diagrams/<name>.svg',{density:144}).resize(1600,900).webp({quality:90}).toFile('public/works/<name>.webp')"
```

ファイル名は microCMS の works コンテンツID に合わせる
（`lib/works.ts` の `defaultWorkMedia` で対応づけている）。

## 2枚で共通のルール

| 表現 | 意味 |
|---|---|
| 赤枠 `#e60012` | JQIT が構築した範囲 |
| 赤の破線矢印 | AI が支援する接続 |
| 黒 `#14140f` | 顧客が受け取る納品物 |
| クリーム地＋罫線 | 外部データ・既存業務・前提 |

サイトの作法に合わせる点:

- 角丸は `rx="4"`（表示時に約2px。`--radius-card: 2px` に合わせる）
- 罫線は `stroke-width="2"`（表示時に約1px）
- 色は `app/globals.css` のトークンのみ使う（`#e60012` / `#14140f` / `#6b6b67` / `#e7e5e0` / `#faf9f7` / `#f2f1ee`）
- 英字ラベルは等幅フォント、字間は em 基準（0.24em / 0.12em）、左に赤い短線を置く
- 最小文字は 28px（一覧カードの縮小表示に耐えるため）
