import { createClient, type MicroCMSQueries } from "microcms-js-sdk";
import sanitizeHtml from "sanitize-html";

/**
 * ニュース記事。microCMS 側のAPIスキーマ（エンドポイント: news）:
 * - title: テキストフィールド
 * - date: 日時
 * - category: セレクトフィールド（お知らせ / プレス / 採用 / イベント）
 * - eyecatch: 画像（一覧・詳細上部に表示）
 * - gallery: 複数画像（イベント写真などに表示）
 * - body: リッチエディタ（microCMS初期テンプレートの content も本文として扱う）
 */
export type NewsCategory = "お知らせ" | "プレス" | "採用" | "イベント";

export type MicroCMSImage = {
  url: string;
  width?: number;
  height?: number;
};

type MicroCMSCategory =
  | string
  | string[]
  | {
      name?: string;
      id?: string;
    };

export type News = {
  id: string;
  title: string;
  date: string;
  publishedAt?: string;
  updatedAt?: string;
  excerpt?: string;
  authorName?: string;
  authorRole?: string;
  category: NewsCategory | string;
  eyecatch?: MicroCMSImage;
  gallery?: MicroCMSImage[];
  body?: string;
};

type MicroCMSNews = {
  id: string;
  title: string;
  date?: string;
  publishedAt?: string;
  updatedAt?: string;
  excerpt?: string;
  authorName?: string;
  authorRole?: string;
  category?: MicroCMSCategory;
  eyecatch?: MicroCMSImage;
  gallery?: MicroCMSImage[];
  body?: string;
  content?: string;
};

const defaultNewsMedia: Record<
  string,
  {
    eyecatch?: MicroCMSImage;
    gallery?: MicroCMSImage[];
  }
> = {
  "site-renewal-2026": {
    eyecatch: {
      url: "/natural-tech-wide.webp",
      width: 1915,
      height: 821,
    },
  },
  "soukai-202604": {
    eyecatch: {
      url: "/news/soukai-202604.jpg",
      width: 1600,
      height: 1200,
    },
    gallery: [
      {
        url: "/news/soukai-202604.jpg",
        width: 1600,
        height: 1200,
      },
      {
        url: "/news/kouryu-202604.jpg",
        width: 1600,
        height: 1200,
      },
    ],
  },
  "kouryu-202604": {
    eyecatch: {
      url: "/news/kouryu-202604.jpg",
      width: 1600,
      height: 1200,
    },
  },
  "iso27001-isms-20260306": {
    eyecatch: {
      url: "/badges/isms-iso27001.png",
      width: 3300,
      height: 1279,
    },
  },
};

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

const client =
  serviceDomain && apiKey ? createClient({ serviceDomain, apiKey }) : null;

/** microCMS が接続済みかどうか（未接続時はフォールバックデータで動作） */
export const isCmsConfigured = client !== null;

function isNotFoundError(e: unknown): boolean {
  return e instanceof Error && /\b404\b/.test(e.message);
}

function optimizeMicroCmsImageUrl(src: string): string {
  try {
    const url = new URL(src);
    const isMicroCmsImage =
      url.protocol === "https:" && url.hostname === "images.microcms-assets.io";
    const isAnimationOrVector = /\.(?:gif|svg)$/i.test(url.pathname);

    if (!isMicroCmsImage || isAnimationOrVector) return src;

    url.searchParams.set("fm", "webp");
    if (!url.searchParams.has("q")) url.searchParams.set("q", "75");
    if (!url.searchParams.has("w")) url.searchParams.set("w", "1200");
    return url.toString();
  } catch {
    return src;
  }
}

/** リッチエディタ由来のHTMLをサーバー側でサニタイズ（CMSアカウント侵害時の多層防御） */
export function prepareNewsBodyHtml(html: string | undefined): string | undefined {
  if (!html) return html;
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "figure", "figcaption"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    transformTags: {
      // target="_blank" には rel を強制付与（tabnabbing対策）
      a: (tagName, attribs) =>
        attribs.target === "_blank"
          ? { tagName, attribs: { ...attribs, rel: "noopener noreferrer" } }
          : { tagName, attribs },
      // microCMS本文の静止画はImage APIで軽量なWebPへ変換する
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.src ? { src: optimizeMicroCmsImageUrl(attribs.src) } : {}),
        },
      }),
    },
  });
}

function extractImagesFromHtml(html: string | undefined): MicroCMSImage[] {
  if (!html) return [];

  const images: MicroCMSImage[] = [];
  const imgPattern = /<img\b[^>]*>/gi;
  const attrPattern = /\s(src|width|height)=["']([^"']+)["']/gi;

  for (const imgTag of html.match(imgPattern) ?? []) {
    const attrs: Record<string, string> = {};
    attrPattern.lastIndex = 0;

    for (const match of imgTag.matchAll(attrPattern)) {
      attrs[match[1]] = match[2];
    }

    if (attrs.src) {
      images.push({
        url: attrs.src,
        width: attrs.width ? Number(attrs.width) : undefined,
        height: attrs.height ? Number(attrs.height) : undefined,
      });
    }
  }

  return images;
}

function normalize(item: MicroCMSNews): News {
  const category = Array.isArray(item.category)
    ? (item.category[0] ?? "お知らせ")
    : typeof item.category === "object" && item.category !== null
      ? (item.category.name ?? "お知らせ")
      : (item.category ?? "お知らせ");
  const defaultMedia = defaultNewsMedia[item.id];
  const gallery = item.gallery?.filter((image) => image.url);
  const rawBody = item.body ?? item.content;
  const bodyImages = extractImagesFromHtml(rawBody);

  return {
    id: item.id,
    title: item.title,
    // 日時フィールドは ISO 文字列で返るため日付部分のみ使う
    date: (item.date ?? item.publishedAt)?.slice(0, 10) ?? "",
    publishedAt: item.publishedAt ?? item.date,
    updatedAt: item.updatedAt ?? item.publishedAt ?? item.date,
    excerpt: item.excerpt?.trim() || undefined,
    authorName: item.authorName?.trim() || undefined,
    authorRole: item.authorRole?.trim() || undefined,
    category,
    eyecatch: item.eyecatch ?? bodyImages[0] ?? defaultMedia?.eyecatch,
    gallery:
      gallery && gallery.length > 0
        ? gallery
        : bodyImages.length > 0
          ? undefined
          : defaultMedia?.gallery,
    body: prepareNewsBodyHtml(rawBody),
  };
}

function isStarterSample(item: News): boolean {
  const body = item.body ?? "";
  return (
    item.title.includes("（サンプル）") ||
    body.includes("お知らせテンプレートから作成されました") ||
    body.includes("APIプレビューを試そう")
  );
}

async function fallbackNews(limit?: number): Promise<News[]> {
  const { fallbackNews } = await import("./news-fallback");
  return fallbackNews.slice(0, limit ?? fallbackNews.length);
}

export async function getNewsList(queries?: MicroCMSQueries): Promise<News[]> {
  if (!client) {
    return fallbackNews(queries?.limit);
  }
  try {
    const res = await client.getList<MicroCMSNews>({
      endpoint: "news",
      queries: { orders: "-date", ...queries },
    });
    const news = res.contents
      .map(normalize)
      .filter((item) => !isStarterSample(item))
      .sort((a, b) => b.date.localeCompare(a.date));
    return news.length > 0 ? news : fallbackNews(queries?.limit);
  } catch (e) {
    if (!isNotFoundError(e)) {
      console.error("[microcms] ニュース一覧の取得に失敗。フォールバックを使用:", e);
    }
    return fallbackNews(queries?.limit);
  }
}

export async function getNewsDetail(id: string): Promise<News | null> {
  if (!client) {
    const { fallbackNews } = await import("./news-fallback");
    return fallbackNews.find((n) => n.id === id) ?? null;
  }
  try {
    const item = await client.getListDetail<MicroCMSNews>({
      endpoint: "news",
      contentId: id,
    });
    const news = normalize(item);
    if (isStarterSample(news)) return null;
    return news;
  } catch (e) {
    // 404（未公開・削除済み）は正常系なのでログしない
    // 注: microcms-js-sdk はステータスを構造化して公開しないため、
    // "status: 404" のメッセージ形式（SDK v3系）を単語境界付きで判定する
    if (!isNotFoundError(e)) {
      console.error(`[microcms] ニュース詳細(${id})の取得に失敗:`, e);
    }
    const { fallbackNews } = await import("./news-fallback");
    return fallbackNews.find((n) => n.id === id) ?? null;
  }
}

export function formatNewsDate(date: string): string {
  return date.replaceAll("-", ".");
}
