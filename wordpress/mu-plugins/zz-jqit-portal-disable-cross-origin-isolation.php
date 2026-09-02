<?php
/**
 * Plugin Name: JQIT Portal Disable Cross-Origin Isolation
 * Description: WordPress 7.1 のブロックエディタ用クロスオリジン分離を無効化し、portal.jqit.co.jp 直参照アセットが CORS で弾かれないようにする。
 */

/**
 * WordPress 7.1 は投稿編集画面（post.php / post-new.php / site-editor.php / widgets.php）で
 * Chromium 137 以上のブラウザに対し、Document-Isolation-Policy ヘッダを送り、
 * site_url() で始まらない URL の script / link タグへ crossorigin="anonymous" を付与する
 * （wp_set_up_cross_origin_isolation → wp_add_crossorigin_attributes）。
 *
 * このサイトは www.jqit.co.jp/portal（Vercel 経由）を site_url とし、静的アセットは
 * さくら側の portal.jqit.co.jp を直参照している。さくら側は Access-Control-Allow-Origin を
 * 返さないため、crossorigin 付きのアセットはすべて CORS でブロックされ、編集画面が真っ白になる。
 *
 * クロスオリジン分離の目的はブラウザ内（WebAssembly）でのメディア変換で、この機能を
 * 使わなければ編集自体に支障はない。フィルタで無効化し、7.0 以前と同じ配信経路に戻す。
 *
 * @return bool 常に false。
 */
function jqit_portal_disable_client_side_media_processing() {
	return false;
}

add_filter( 'wp_client_side_media_processing_enabled', 'jqit_portal_disable_client_side_media_processing', PHP_INT_MAX );
