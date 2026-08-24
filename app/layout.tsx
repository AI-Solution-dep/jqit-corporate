import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono, Noto_Sans_JP } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, defaultSocialImage } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}｜${siteConfig.tagline}`,
    template: `%s｜${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name}｜${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: "ja_JP",
    url: siteConfig.url,
    images: [{ ...defaultSocialImage, url: absoluteUrl(defaultSocialImage.url) }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}｜${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ ...defaultSocialImage, url: absoluteUrl(defaultSocialImage.url) }],
  },
  verification: {
    google: "YwwbN-IBAi6OeoLHAtdyIIqvexUh-0zK8wISJFSP4bM",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      alternateName: siteConfig.nameEn,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/jqit-logo.png`,
        width: 425,
        height: 118,
      },
      foundingDate: siteConfig.foundedDate,
      telephone: siteConfig.tel,
      address: {
        "@type": "PostalAddress",
        addressCountry: "JP",
        postalCode: "150-0002",
        addressRegion: "東京都",
        addressLocality: "渋谷区",
        streetAddress: "渋谷1-12-2 クロスオフィス渋谷609",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.tel,
        contactType: "customer service",
        areaServed: "JP",
        availableLanguage: "Japanese",
      },
      slogan: siteConfig.tagline,
      description: siteConfig.description,
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        value: 106,
        unitText: "名",
      },
      // 全ページに出る Organization から参照するため、@id だけでなく
      // 最小限の実体を持たせる（Person ノードの本体は /about 側）。
      founder: {
        "@type": "Person",
        "@id": `${siteConfig.url}/about#ceo`,
        name: siteConfig.ceo,
        jobTitle: "代表取締役社長",
      },
      award: ["2026年度 財界 BEST AI 100"],
      // 認証・許認可は lib/site-config.ts の certifications と対応。
      // 一次情報が公開されているものは url を添えて検証可能にする。
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "certification",
          name: "ISO/IEC 27001（ISMS）",
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "certification",
          name: "DX認定",
          recognizedBy: { "@type": "GovernmentOrganization", name: "経済産業省" },
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "certification",
          name: "ISTQB® Gold パートナー",
          url: "https://www.jstqb.jp/partnership/",
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "license",
          name: "労働者派遣事業許可 派13-318536",
          recognizedBy: { "@type": "GovernmentOrganization", name: "厚生労働省" },
        },
      ],
      knowsAbout: [
        "SES（システムエンジニアリングサービス）",
        "受託開発",
        "QA・第三者検証",
        "ITインフラ構築",
        "AIエージェント開発",
        "RAG構築",
        "生成AI導入支援",
      ],
      sameAs: [
        siteConfig.links.x,
        siteConfig.links.instagram,
        siteConfig.links.qiita,
        siteConfig.links.note,
        siteConfig.links.nova,
        siteConfig.links.aiSupport,
        siteConfig.links.recruit,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      alternateName: siteConfig.nameEn,
      inLanguage: "ja-JP",
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/#webpage`,
      url: siteConfig.url,
      name: `${siteConfig.name}｜${siteConfig.tagline}`,
      description: siteConfig.description,
      inLanguage: "ja-JP",
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#organization` },
      significantLink: [
        `${siteConfig.url}/about`,
        `${siteConfig.url}/business/it-solutions`,
        `${siteConfig.url}/business/ai-solutions`,
        `${siteConfig.url}/corporate-vision`,
        `${siteConfig.url}/news`,
        `${siteConfig.url}/contact`,
      ],
    },
  ],
} satisfies Record<string, unknown>;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} ${inter.variable} ${jetBrainsMono.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <GoogleAnalytics />
        <JsonLd data={websiteJsonLd} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-card focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          本文へスキップ
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
