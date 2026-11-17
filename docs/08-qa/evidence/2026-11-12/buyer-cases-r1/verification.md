# 顧客事例の入口改善

- 紹介ページの顧客事例2件を課題/担当した開発/納品利用状況/詳細/相談で整理。
- 公開worksを読み、期間・体制は既存値がある場合だけ表示。null/isSampleは除外。CMSへの書込みなし。
- 顧客事例を先に、自社プロダクトNOVAを後に配置。イラストを実顧客の画面として扱わない。
- ESLint/TypeScript、90ページのビルド、紹介のnoindex/ナビ・サイトマップ非掲載テスト2件に合格。
- 独立の発注企業/UIレビューPASS。375/768/1280の表示、詳細2件/相談リンク、記事整合、横溢れ/JS例外なしを確認。
- 保護対象Hero/Carousel/Entrance/CSS/hero-collageはSHA256一致。
- 新規認証/外部送信/CSP変更なし。既存サーバー読取とReactのテキスト描画のみ。sourceのHTMLはplainTextFromHtmlでテキスト化。外部からのHTML挿入を追加しない。
