/**
 * サイト全体の設定。外部URL・連絡先はすべてここに集約する。
 * 会社情報は既存HP（https://jqit.co.jp/company/）由来の実データ。
 */
export const siteConfig = {
  name: "株式会社JQIT",
  nameEn: "JQIT Co., Ltd.",
  tagline: "挑戦と革新で、顧客の未来を切り拓く。",
  description:
    "私たちは、技術の力でお客様の“本質的な課題”を解決するITのプロフェッショナル集団です。ITソリューション事業とAIソリューション事業の両輪で、企業の挑戦を支えます。",
  url: "https://www.jqit.co.jp",

  tel: "03-6433-5383",
  telHref: "tel:0364335383",
  fax: "03-6433-5384",
  address: "〒150-0002 東京都渋谷区渋谷1-12-2 クロスオフィス渋谷609",
  addressLines: ["〒150-0002 東京都渋谷区渋谷1-12-2", "クロスオフィス渋谷609"],
  addressShort: "東京都渋谷区渋谷1-12-2 クロスオフィス渋谷609",
  businessHours: "平日 10:00 - 19:00",
  founded: 2024,
  foundedDate: "2024-12-06",
  ceo: "山田 周作",
  capital: "1,000万円",
  employees: "106名（2026年4月時点）",

  certifications: [
    "ISO/IEC 27001（ISMS）",
    "DX認定",
    "ISTQB® Gold パートナー",
    "2026年度 財界 BEST AI 100",
    "労働者派遣事業 派13-318536",
  ],

  links: {
    // 新採用サイト（GitHub Pages）。独自ドメイン移行時はここを差し替え
    recruit: "https://jqt-ai-sol.github.io/jqit-careers/",
    nova: "https://nova-ai.jp/",
    aiSupport: "https://ai.jqit.co.jp/",
    qiita: "https://qiita.com/organizations/jqiit-co",
    note: "https://note.com/jqit_itsaiyo",
    x: "https://x.com/JQIT_info",
    instagram: "https://www.instagram.com/jqit202412/",
  },
} as const;

export type CertificationBadge = {
  label: string;
  /** 公式ロゴ画像（既存HPで正式に掲示しているもののみ）。無い認証はテキスト表記 */
  image?: { src: string; width: number; height: number };
};

/** 認証・許認可バッジ。ロゴ画像は https://jqit.co.jp/company/ に掲示中の公式マークを流用 */
export const certificationBadges: CertificationBadge[] = [
  {
    label: "ISO/IEC 27001（ISMS）",
    image: { src: "/badges/isms-iso27001.png", width: 200, height: 78 },
  },
  {
    label: "DX認定",
    image: { src: "/badges/dx-nintei.png", width: 1736, height: 492 },
  },
  {
    label: "ISTQB® Gold パートナー",
    image: { src: "/badges/istqb-gold.png", width: 2063, height: 738 },
  },
  {
    label: "2026年度 財界 BEST AI 100",
    image: { src: "/badges/zaikai-best-ai-100.png", width: 1500, height: 240 },
  },
  { label: "労働者派遣事業 派13-318536" },
];

export type NavChild = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavItem = {
  label: string;
  en: string;
  href: string;
  external?: boolean;
  /** ドロップダウン（PC）/ サブリンク（モバイル）に展開する配下ページ */
  children?: NavChild[];
};

export const globalNav: NavItem[] = [
  {
    label: "会社情報",
    en: "About",
    href: "/about",
    children: [
      { label: "会社概要・代表メッセージ", href: "/about" },
      { label: "ビジョンと戦略", href: "/corporate-vision" },
      { label: "情報セキュリティ基本方針", href: "/security-policy" },
    ],
  },
  {
    label: "事業",
    en: "Business",
    href: "/#business",
    children: [
      { label: "ITソリューション事業", href: "/business/it-solutions" },
      { label: "AIソリューション事業", href: "/business/ai-solutions" },
    ],
  },
  {
    label: "サービス",
    en: "Service",
    href: "/#service",
    children: [
      { label: "NOVA", href: siteConfig.links.nova, external: true },
      { label: "AI導入伴走支援", href: siteConfig.links.aiSupport, external: true },
    ],
  },
  { label: "ニュース", en: "News", href: "/news" },
  { label: "採用", en: "Recruit", href: siteConfig.links.recruit, external: true },
];

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const footerNav: { head: string; links: FooterLink[] }[] = [
  {
    head: "Company",
    links: [
      { label: "会社情報", href: "/about" },
      { label: "代表メッセージ", href: "/about#message" },
      { label: "ビジョンと戦略", href: "/corporate-vision" },
      { label: "ニュース", href: "/news" },
      { label: "情報セキュリティ基本方針", href: "/security-policy" },
    ],
  },
  {
    head: "Business",
    links: [
      { label: "ITソリューション事業", href: "/business/it-solutions" },
      { label: "AIソリューション事業", href: "/business/ai-solutions" },
      { label: "NOVA（製品サイト）", href: siteConfig.links.nova, external: true },
      { label: "AI導入伴走支援", href: siteConfig.links.aiSupport, external: true },
      { label: "パートナー", href: "/#partner" },
    ],
  },
  {
    head: "Careers & Media",
    links: [
      { label: "採用情報", href: siteConfig.links.recruit, external: true },
      { label: "Qiita", href: siteConfig.links.qiita, external: true },
      { label: "note", href: siteConfig.links.note, external: true },
    ],
  },
];
