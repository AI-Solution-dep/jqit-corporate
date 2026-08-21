/**
 * Qiita の記事を microCMS の column エンドポイントへ取り込むスクリプト。
 *
 *   node scripts/microcms/import-qiita-column.mjs                # 下見（何も書き込まない）
 *   node scripts/microcms/import-qiita-column.mjs --apply        # 下書きとして投入
 *   node scripts/microcms/import-qiita-column.mjs --apply --publish
 *
 * オプション:
 *   --user <id>        Qiita ユーザーID（既定: TMiyamoto）
 *   --only <id,...>    取り込む Qiita 記事IDを限定
 *   --exclude <id,...> 除外する Qiita 記事ID
 *   --apply            実際に microCMS へ書き込む（既定は下見のみ）
 *   --publish          下書きではなく公開状態で投入する
 *   --out <dir>        下見時にHTMLとJSONを書き出す先（既定: .qiita-import）
 *
 * 記事本文は Qiita の rendered_body（HTML）を整形して使う。Markdown を
 * 変換し直すより、Qiita 側の表示に忠実で崩れにくい。
 *
 * 画像は Qiita の S3 を直リンクせず public/column/<slug>/ へ複製する。
 * 外部ホストへの依存を残さないため。
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sanitizeHtml from "sanitize-html";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "../..");
loadEnv(resolve(root, ".env.local"));

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const has = (name) => args.includes(`--${name}`);
const list = (name) =>
  (opt(name, "") || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const qiitaUser = opt("user", "TMiyamoto");
const apply = has("apply");
const publish = has("publish");
const outDir = resolve(root, opt("out", ".qiita-import"));
const only = new Set(list("only"));
const exclude = new Set(list("exclude"));

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_MCP_API_KEY || process.env.MICROCMS_API_KEY;

const slugFile = resolve(root, "scripts/microcms/qiita-column-slugs.json");
const slugMap = existsSync(slugFile)
  ? JSON.parse(readFileSync(slugFile, "utf8"))
  : {};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function main() {
  if (apply && (!serviceDomain || !apiKey)) {
    throw new Error("MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が .env.local にありません。");
  }

  const items = await fetchQiitaItems(qiitaUser);
  const targets = items.filter(
    (it) => (only.size === 0 || only.has(it.id)) && !exclude.has(it.id),
  );

  console.log(`Qiita ${qiitaUser}: ${items.length}件中 ${targets.length}件を対象にします`);
  if (!apply) console.log("（下見モード。--apply を付けると microCMS へ書き込みます）\n");

  for (const item of targets) {
    const slug = slugMap[item.id] ?? item.id;
    const { html, images } = await buildBody(item, slug);
    const content = {
      title: item.title,
      date: item.created_at,
      tags: item.tags.map((t) => t.name).join(", "),
      excerpt: buildExcerpt(html),
      body: html,
      qiitaUrl: item.url,
    };

    console.log(`- ${slug}`);
    console.log(`    ${item.title}`);
    console.log(`    本文 ${html.length}字 / 画像 ${images}枚 / タグ ${content.tags}`);

    if (apply) {
      await putContent(slug, content);
      console.log(`    → microCMS へ投入（${publish ? "公開" : "下書き"}）`);
    } else {
      mkdirSync(outDir, { recursive: true });
      writeFileSync(resolve(outDir, `${slug}.json`), JSON.stringify(content, null, 2));
      writeFileSync(resolve(outDir, `${slug}.html`), html);
    }
  }

  if (!apply) console.log(`\n下見の出力: ${outDir}`);
}

async function fetchQiitaItems(user) {
  const res = await fetch(
    `https://qiita.com/api/v2/users/${encodeURIComponent(user)}/items?per_page=100`,
  );
  if (!res.ok) throw new Error(`Qiita API ${res.status}`);
  return res.json();
}

/**
 * Qiita が本文に差し込む装飾を先に落とす。
 * sanitize-html の transformTags でタグを置き換える方法だと、見出しアンカーの
 * <i> のような要素でタグの対応が崩れて後続の閉じタグが壊れるため、
 * 素直に除去してから sanitize に渡す。
 */
function stripQiitaChrome(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<i\b[^>]*>[\s\S]*?<\/i>/gi, "")
    .replace(/<i\b[^>]*\/?>/gi, "")
    .replace(/<span\b[^>]*class="[^"]*fragment[^"]*"[^>]*>\s*<\/span>/gi, "")
    .replace(/<div\b[^>]*class="[^"]*code-lang[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
}

/**
 * サイト側で扱える素朴なHTMLだけを残す。
 * div / span は許可タグに入れていないので、中身を残したまま外側だけ外れる
 * （code-frame や highlight のラッパーが消えて <pre><code> が残る）。
 * h1 は記事タイトルと重複するため h2 に下げる。
 */
function cleanQiitaHtml(html) {
  const cleaned = sanitizeHtml(stripQiitaChrome(html), {
    allowedTags: [
      "h2", "h3", "h4", "h5", "p", "a", "ul", "ol", "li", "strong", "em", "del",
      "code", "pre", "blockquote", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td", "hr", "br", "sup", "sub",
    ],
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: { h1: "h2" },
  });

  // 中身が空になったリンク・段落を落とす（見出しアンカーの残骸）。
  // sanitize-html の exclusiveFilter だと、画像だけを含む <a> も
  // 「テキストが空」と判定されて画像ごと消えるため、後処理で行う。
  return cleaned
    .replace(/<a\b[^>]*>\s*<\/a>/g, "")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/\n{3,}/g, "\n\n");
}

/**
 * 記事冒頭の見出しが記事タイトルと同じなら落とす。
 * Qiita 側で本文の1行目に「# タイトル」を書いている記事があり、
 * そのままだとページ内で見出しが二重に出るため。
 */
function dropLeadingTitleHeading(html, title) {
  const normalize = (v) => v.replace(/<[^>]*>/g, "").replace(/\s+/g, "").trim();
  return html.replace(/^\s*<h([23])>([\s\S]*?)<\/h\1>/, (whole, _level, inner) =>
    normalize(inner) === normalize(title) ? "" : whole,
  );
}

/**
 * 画像を microCMS のメディアへアップロードする。
 * リッチエディタは microCMS 以外のURL・相対パスの <img> を保存時に落とすため、
 * 本文の画像は microCMS 側に置く必要がある。
 * マネジメントAPIの「メディアのアップロード」権限が要る。
 */
async function uploadMedia(buffer, filename, contentType) {
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: contentType }), filename);

  // メディアアップロードはレート制限が厳しく 429 が返るため、間隔を空けて再試行する
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const res = await fetch(`https://${serviceDomain}.microcms-management.io/api/v1/media`, {
      method: "POST",
      headers: { "X-MICROCMS-API-KEY": apiKey },
      body: form,
    });
    if (res.ok) return (await res.json()).url;
    if (res.status !== 429) {
      throw new Error(`media upload ${res.status} ${await res.text()}`);
    }
    await sleep(attempt * 2000);
  }
  throw new Error("media upload 429（再試行の上限に達しました）");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * 取り込みをやり直したときに、すでに microCMS へ上げた画像を再アップロードしない。
 * 本文HTMLは決まった手順で生成されるので、画像の並び順で対応づけできる。
 */
async function existingImageUrls(contentId) {
  const res = await fetch(
    `https://${serviceDomain}.microcms.io/api/v1/column/${contentId}?fields=body`,
    { headers: { "X-MICROCMS-API-KEY": apiKey } },
  );
  if (!res.ok) return [];
  const body = (await res.json()).body ?? "";
  return [...body.matchAll(/<img[^>]*src="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((url) => url.startsWith("https://images.microcms-assets.io/"));
}

/**
 * 記事本文の画像を microCMS のメディアへ移し、src を差し替える。
 * アップロードできない場合（権限が無い等）は public/column/<slug>/ に複製して
 * ローカルパスを指す。ただしその場合、リッチエディタ側で <img> が落ちる。
 */
async function buildBody(item, slug) {
  let html = dropLeadingTitleHeading(cleanQiitaHtml(item.rendered_body), item.title);
  const srcs = [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  const unique = [...new Set(srcs.filter((s) => /^https?:\/\//.test(s)))];
  const dir = resolve(root, "public/column", slug);

  const reusable = apply ? await existingImageUrls(slug) : [];

  let index = 0;
  for (const src of unique) {
    index += 1;
    const alreadyUploaded = reusable[index - 1];
    if (alreadyUploaded) {
      html = html.replaceAll(`src="${src}"`, `src="${alreadyUploaded}"`);
      continue;
    }
    const ext = guessExtension(src.replaceAll("&amp;", "&"));
    // アニメーション・ベクターはそのまま、静止画は WebP に変換して軽くする
    const keepAsIs = ext === ".gif" || ext === ".svg";
    const name = `img-${String(index).padStart(2, "0")}${keepAsIs ? ext : ".webp"}`;
    const localPath = `/column/${slug}/${name}`;

    // sanitize 後のHTMLでは & が &amp; に実体参照化されている。
    // imgix は署名付きURLなので、戻さないと取得に失敗する。
    const res = await fetch(src.replaceAll("&amp;", "&"));
    if (!res.ok) {
      console.warn(`    ! 画像の取得に失敗（元のURLのまま残します）: ${src}`);
      continue;
    }
    const original = Buffer.from(await res.arrayBuffer());
    const optimized = keepAsIs
      ? original
      : await sharp(original)
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

    let replacement = localPath;
    if (apply) {
      try {
        replacement = await uploadMedia(
          optimized,
          name,
          keepAsIs ? `image/${ext.slice(1)}` : "image/webp",
        );
        await sleep(700);
      } catch (e) {
        console.warn(`    ! メディアのアップロードに失敗（ローカルに複製します）: ${e.message}`);
      }
    }
    if (replacement === localPath) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(resolve(dir, name), optimized);
    }
    html = html.replaceAll(`src="${src}"`, `src="${replacement}"`);
  }

  return { html, images: unique.length };
}

function guessExtension(url) {
  const match = new URL(url).pathname.match(/\.(png|jpe?g|gif|webp|svg)$/i);
  return match ? match[0].toLowerCase() : ".png";
}

/**
 * 一覧カード用の要約。本文の段落から自動生成する。
 * 冒頭のあいさつ文は要約にならないため飛ばして、最初の実質的な段落を使う。
 * あくまで下地なので、公開前に手で書き直すことを前提にしている。
 */
function buildExcerpt(html) {
  const paragraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map((m) => m[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const greeting = /^(こんにちは|こんばんは|はじめまして|お疲れ)/;
  const text =
    paragraphs.find((t) => t.length >= 40 && !greeting.test(t)) ?? paragraphs[0] ?? "";
  return text.length > 120 ? `${text.slice(0, 119)}…` : text;
}

/**
 * 新規なら PUT、既にあれば PATCH で上書きする。
 * PUT は既存コンテンツに対して 400 を返すため、取り込みをやり直せるようにしている。
 */
async function putContent(contentId, content) {
  const url = new URL(
    `https://${serviceDomain}.microcms.io/api/v1/column/${contentId}`,
  );
  // status=draft は Team プラン以上のみ有効。下位プランでは無視され公開状態になる。
  if (!publish) url.searchParams.set("status", "draft");

  const send = (method) =>
    fetch(url, {
      method,
      headers: {
        "X-MICROCMS-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });

  let res = await send("PUT");
  if (res.status === 400 && (await res.clone().text()).includes("already exists")) {
    res = await send("PATCH");
  }
  if (!res.ok) {
    throw new Error(`microCMS ${contentId}: ${res.status} ${await res.text()}`);
  }
  return res.status;
}

function loadEnv(path) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    process.env[key] = rawValue.replace(/^(['"])(.*)\1$/, "$2").replace(/\\n/g, "\n");
  }
}
