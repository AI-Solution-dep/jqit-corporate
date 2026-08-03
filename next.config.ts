import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1: GitHub Pages 向け静的エクスポート。
 * basePath はリポジトリ名（https://<owner>.github.io/jqit-corporate/）に一致させる。
 * lib/static-image-loader.ts の basePath と同期を保つこと。
 * 通常ビルド（Vercel等・ローカル）は Server Actions / ISR をそのまま使う。
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const contentSecurityPolicy = [
  "default-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://portal.jqit.co.jp",
  "frame-ancestors 'none'",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https://portal.jqit.co.jp",
  "script-src 'self' 'unsafe-inline' https://portal.jqit.co.jp",
  "font-src 'self' data: https://portal.jqit.co.jp",
  "connect-src 'self' https://portal.jqit.co.jp",
  "frame-src https://www.google.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
] as const;

const legacyPageRedirects = [
  { source: "/company", destination: "/about" },
  { source: "/business", destination: "/#business" },
  { source: "/category/news", destination: "/news" },
  { source: "/recruit/:path*", destination: "https://recruitment.jqit.co.jp" },
  { source: "/メンテナンスページ", destination: "/" },
  { source: "/business/ai-solutions/:path+", destination: "/business/it-solutions" },
] as const;

const legacyPageRewrites = [
  {
    source: "/portal/wp-admin",
    destination: "/api/portal-admin",
  },
  {
    source: "/portal/wp-admin/",
    destination: "/api/portal-admin",
  },
  {
    source: "/portal/wp-login.php",
    destination: "https://portal.jqit.co.jp/jqit-portal-login-proxy.php",
  },
  {
    source: "/portal/:path*",
    destination: "https://portal.jqit.co.jp/:path*",
  },
] as const;

const legacyNewsRedirects = [
  { source: "/2026/04/15/:slug", destination: "/news/soukai-202604" },
  { source: "/2026/04/12/:slug", destination: "/news/kouryu-202604" },
  { source: "/2026/03/31/:slug", destination: "/news/wp-2268" },
  { source: "/2026/03/06/:slug", destination: "/news/iso27001-isms-20260306" },
  { source: "/2026/03/02/:slug", destination: "/news/wp-2244" },
  { source: "/2026/03/01/:slug", destination: "/news/wp-2241" },
  { source: "/2026/02/22/:slug", destination: "/news/wp-2234" },
  { source: "/2026/01/24/:slug", destination: "/news/wp-2098" },
  { source: "/2026/01/16/:slug", destination: "/news/wp-2011" },
  { source: "/2026/01/05/:slug", destination: "/news/wp-2009" },
  { source: "/2025/12/26/:slug", destination: "/news/wp-2007" },
  { source: "/2025/12/19/:slug", destination: "/news/wp-2005" },
  { source: "/2025/12/14/:slug", destination: "/news/wp-2003" },
  { source: "/2025/12/07/:slug", destination: "/news/wp-2000" },
  { source: "/2025/11/29/:slug", destination: "/news/wp-1998" },
  { source: "/2025/11/21/:slug", destination: "/news/wp-1996" },
  { source: "/2025/11/14/:slug", destination: "/news/wp-1994" },
  { source: "/2025/11/06/:slug", destination: "/news/wp-1992" },
  { source: "/2025/11/04/:slug", destination: "/news/wp-1990" },
  { source: "/2025/10/30/:slug", destination: "/news/wp-1988" },
  { source: "/2025/10/27/:slug", destination: "/news/wp-1986" },
  { source: "/2025/10/23/:slug", destination: "/news/wp-1984" },
  { source: "/2025/10/03/:slug", destination: "/news/wp-1981" },
  { source: "/2025/09/26/:slug", destination: "/news/wp-1979" },
  { source: "/2025/09/18/:slug", destination: "/news/wp-1977" },
  { source: "/2025/09/12/:slug", destination: "/news/wp-1975" },
  { source: "/2025/09/08/:slug", destination: "/news/wp-1973" },
  { source: "/2025/09/05/:slug", destination: "/news/wp-1971" },
  { source: "/2025/08/29/:slug", destination: "/news/wp-1968" },
  { source: "/2025/06/13/:slug", destination: "/news/wp-1" },
] as const;

const nextConfig: NextConfig = isStaticExport
  ? {
      poweredByHeader: false,
      output: "export",
      basePath: "/jqit-corporate",
      trailingSlash: true,
      images: {
        loader: "custom",
        loaderFile: "./lib/static-image-loader.ts",
        remotePatterns: [
          {
            protocol: "https",
            hostname: "images.microcms-assets.io",
          },
        ],
      },
    }
  : {
      poweredByHeader: false,
      skipTrailingSlashRedirect: true,
      images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "images.microcms-assets.io",
          },
        ],
      },
      async redirects() {
        return [...legacyPageRedirects, ...legacyNewsRedirects].map((redirect) => ({
          ...redirect,
          permanent: true,
        }));
      },
      async rewrites() {
        return [...legacyPageRewrites];
      },
      async headers() {
        return [{ source: "/:path*", headers: [...securityHeaders] }];
      },
    };

export default nextConfig;
