# TOPのリンク遷移再生

- 変更前: /aboutからロゴのLinkでTOPへ戻るとplayback=complete/glyphs=0/scrollY=0。リロード以外では再生しない不具合を再現。
- 変更後: 初回、会社概要からのLink、キャッシュされたTOPへの2度目のLinkでplaying/glyphs=35/scrollY=0。
- アンカー /#business はcomplete/glyphs=0、アンカー位置を保持。
- reduced-motionではreduced/glyphs=0。確定した写真・文字の順序、各速度は変更なし。
- TOP帰着時にはページ遷移の幕を出さず、最初のラベルを隠さない。
- 代表者行を撤去し、役員構成に代表取締役社長と取締役をまとめる。
- セキュリティ確認: 外部入力・外部送信・API・認証・CSP変更なし。固定DOMの初期化と既存アニメーションの再起動のみ。
