# 見出し受け渡しモックの確認

- 対象: TOP / と紹介 /introduction。
- ESLint/TypeScript/紹介ページ非公開ゲート2件合格。
- Hero.tsx / HeroCarousel.tsx / HeroEntrance.tsx / hero-entrance.css / hero-collage.webpは作業前後SHA256一致。
- TOP登場: playing、totalDuration6380ms、主写真opacity1。会社概要へ遷移後のクローン残留0、TOPへ戻るとplanes12/clones1/playing。
- 紹介team: スクロール160pxで見出しscale.959→.658、受取位置へ移動。同じ間に背景の面のtransformも別の量で変わる。
- JS無効の紹介team実見出しopacity1。印刷時も元h2opacity1（通常のドック時は0）。JS例外なし。
- デザイナー/コードの独立レビューを2回実施。背景の位置指定の既存CSS干渉、現在章の判定遅れ、印刷時見出し欠落を解消し、双方PASS。
- 新しい外部送信、認証、API、CSPの変更なし。固定のページ見出しをcloneNodeで複製、ID除去、aria-hidden。元h2のセマンティクスを維持し、遷移時にクローンと面、Observer/イベントを解除。
