import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export type SeoImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: SeoImage;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export const defaultSocialImage: SeoImage = {
  // 旧PNG（6.6MB）ではなく、SNSクローラーが安定して取得できる軽量WebPを使う。
  url: "/hero-collage.webp",
  width: 1792,
  height: 1008,
  alt: `${siteConfig.name}｜${siteConfig.tagline}`,
};

export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, `${siteConfig.url}/`).toString();
}

function socialImage(image: SeoImage) {
  return {
    url: absoluteUrl(image.url),
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
    alt: image.alt ?? siteConfig.name,
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  image = defaultSocialImage,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const fullTitle = `${title}｜${siteConfig.name}`;
  const images = [socialImage(image)];

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          type: "article",
          title: fullTitle,
          description,
          url: canonical,
          siteName: siteConfig.name,
          locale: "ja_JP",
          images,
          publishedTime,
          modifiedTime,
        }
      : {
          type: "website",
          title: fullTitle,
          description,
          url: canonical,
          siteName: siteConfig.name,
          locale: "ja_JP",
          images,
        };

  return {
    title,
    description,
    alternates: { canonical },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images,
    },
  };
}

export function plainTextFromHtml(html: string | undefined): string {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function createDescription(text: string, fallback: string, maxLength = 150): string {
  const normalized = text.trim();
  if (!normalized) return fallback;
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function createBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type WebPageJsonLdOptions = {
  type?: "WebPage" | "CollectionPage" | "ContactPage";
  name: string;
  description: string;
  path: string;
  breadcrumbs: BreadcrumbItem[];
};

export function createWebPageJsonLd({
  type = "WebPage",
  name,
  description,
  path,
  breadcrumbs,
}: WebPageJsonLdOptions) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: "ja-JP",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      createBreadcrumbJsonLd(breadcrumbs),
    ],
  };
}
