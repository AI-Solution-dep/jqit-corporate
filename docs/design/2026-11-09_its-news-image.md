# ITS健保加入記事の画像補完

対象: /news/its-kenpo-20261022

公式サイトで https://www.its-kenpo.or.jp/wm_shared/img/logo_sp.png （361×49）のロゴを確認したが、公式利用条件 https://www.its-kenpo.or.jp/jyouken/index.html に画像の無断使用・転載・二次利用禁止と事前照会の案内がある。

公式ロゴは保存・転載せず、加入のお知らせとしてJQIT制作の案内画像を用意。`public/badges/its-kenpo-notice.svg`が制作元、PNGが表示用。元の組合ロゴを模倣せず、通常の文字と一般的な確認マークで構成する。

`defaultNewsMedia`に固定IDのフォールバックだけ追加。CMSアイキャッチ・本文画像の優先順序を維持。本文・日付・公開状態・CMSデータは変更しない。

ローカルでニュース一覧の画像読込、記事画像のdecode成功を確認。型/ESLint/本番ビルド通過。セキュリティ確認は固定ローカル画像の参照追加のみ、外部入力や権限の変更なし。
