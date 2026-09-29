import type { MetadataRoute } from "next";
import { getColumnList } from "@/lib/column";
import { getNewsList } from "@/lib/microcms";
import { isInstagramRepost } from "@/lib/news-seo-overrides";
import { siteConfig } from "@/lib/site-config";
import { getWorksList } from "@/lib/works";

// microCMS の記事を取り込むので ISR で再検証する。既定は revalidate=false（再検証しない）。
// ⚠️ dynamic = "force-static" を付けると再デプロイするまで更新されない。
// 2026-09-29 の本番で、9/28 公開の記事が sitemap に載らず（Age 39時間・lastmod 9/11）確認済み。
export const revalidate = 3600;

// サイト構造や主要導線を含む静的ページの最終更新日。
const STATIC_PAGE_LAST_MODIFIED = new Date("2026-08-12T00:00:00+09:00");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const news = await getNewsList({ limit: 100 });
  const columns = await getColumnList({ limit: 100 });
  const works = await getWorksList({ limit: 100 });
  // microCMS から取得できなかったときはサンプル実績が返る（lib/works-fallback.ts）。
  // 実在しない URL を Google に知らせないよう、sitemap からは外す。
  const publishedWorks = works.filter((w) => !w.isSample);
  const latestNewsModified = news.reduce<Date | undefined>((latest, item) => {
    const value = item.updatedAt ?? item.date;
    if (!value) return latest;
    const date = new Date(value);
    return !latest || date > latest ? date : latest;
  }, undefined);
  const latestColumnModified = columns.reduce<Date | undefined>((latest, item) => {
    const value = item.updatedAt ?? item.date;
    if (!value) return latest;
    const date = new Date(value);
    return !latest || date > latest ? date : latest;
  }, undefined);
  const latestWorkModified = publishedWorks.reduce<Date | undefined>((latest, item) => {
    const value = item.updatedAt ?? item.date;
    if (!value) return latest;
    const date = new Date(value);
    return !latest || date > latest ? date : latest;
  }, undefined);
  const homeLastModified =
    latestNewsModified && latestNewsModified > STATIC_PAGE_LAST_MODIFIED
      ? latestNewsModified
      : STATIC_PAGE_LAST_MODIFIED;

  return [
    {
      url: base,
      lastModified: homeLastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/business/it-solutions`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/business/ai-solutions`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/corporate-vision`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/security-policy`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/contact`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/news`,
      lastModified: latestNewsModified ?? STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/column`,
      lastModified: latestColumnModified ?? STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${base}/works`,
      lastModified: latestWorkModified ?? STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...columns.map((c) => ({
      url: `${base}/column/${c.id}`,
      lastModified: c.updatedAt
        ? new Date(c.updatedAt)
        : c.date
          ? new Date(c.date)
          : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...publishedWorks.map((w) => ({
      url: `${base}/works/${w.id}`,
      lastModified: w.updatedAt
        ? new Date(w.updatedAt)
        : w.date
          ? new Date(w.date)
          : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    // Instagram 投稿の転記は noindex なので sitemap にも載せない
    ...news.filter((n) => !isInstagramRepost(n)).map((n) => ({
      url: `${base}/news/${n.id}`,
      lastModified: n.updatedAt
        ? new Date(n.updatedAt)
        : n.date
          ? new Date(n.date)
          : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
