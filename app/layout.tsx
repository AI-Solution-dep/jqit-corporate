import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono, Noto_Sans_JP } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
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
      sameAs: [
        siteConfig.links.x,
        siteConfig.links.instagram,
        siteConfig.links.qiita,
        siteConfig.links.note,
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
