import type { MetadataRoute } from "next";
import { getNewsList } from "@/lib/microcms";
import { siteConfig } from "@/lib/site-config";

// output: export（GitHub Pages）でも生成できるよう明示
export const dynamic = "force-static";

// 2026-08-02のリニューアル／SEO・AEO改善で静的ページを実質更新。
const STATIC_PAGE_LAST_MODIFIED = new Date("2026-08-02T00:00:00+09:00");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const news = await getNewsList({ limit: 100 });
  const latestNewsModified = news.reduce<Date | undefined>((latest, item) => {
    const value = item.updatedAt ?? item.date;
    if (!value) return latest;
    const date = new Date(value);
    return !latest || date > latest ? date : latest;
  }, undefined);

  return [
    {
      url: base,
      lastModified: latestNewsModified ?? STATIC_PAGE_LAST_MODIFIED,
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
    ...news.map((n) => ({
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
