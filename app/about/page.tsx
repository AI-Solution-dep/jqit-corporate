import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { companySubNav, SubNav } from "@/components/layout/SubNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";
import { SectionHead } from "@/components/ui/SectionHead";
import { TypeText } from "@/components/ui/TypeText";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { certificationBadges, siteConfig } from "@/lib/site-config";
import Link from "next/link";
import { CountUp } from "@/components/about/CountUp";
import { HistoryTimeline, type HistoryYear } from "@/components/about/HistoryTimeline";
import { LogoParticles } from "@/components/about/LogoParticles";

const pageDescription =
  "株式会社JQITの会社情報。企業理念「挑戦と革新で、顧客の未来を切り拓く。」のもと、ITソリューション事業とAIソリューション事業を展開しています。";

export const metadata = createPageMetadata({
  title: "会社情報",
  description: pageDescription,
  path: "/about",
  image: {
    url: "/natural-tech-about.webp",
    width: 1672,
    height: 941,
    alt: "自然光の入る空間で事業戦略を議論するJQITのチーム",
  },
});

const profile = [
  { k: "会社名", v: `${siteConfig.name}（${siteConfig.nameEn}）` },
  { k: "設立", v: "2024年12月6日" },
  { k: "代表者", v: `代表取締役社長　${siteConfig.ceo}` },
  { k: "役員", v: siteConfig.directors.map(({ role, name }) => `${role}　${name}`).join("\n") },
  { k: "資本金", v: siteConfig.capital },
  { k: "所在地", v: `${siteConfig.address}（${siteConfig.officeName}）` },
  { k: "TEL", v: siteConfig.tel },
  {
    k: "事業内容",
    v: "ITソリューション事業（受託開発／SES／インフラ／QA・第三者検証）、AIソリューション事業（生成AI導入支援／AIエージェント開発／AI人材育成）",
  },
  { k: "従業員数", v: siteConfig.employees },
  {
    k: "許認可・認証",
    v: "労働者派遣事業 派13-318536／ISO/IEC 27001（ISMS）／DX認定",
  },
  {
    k: "参画・加入団体",
    v: "2026年度 財界 BEST AI 100／ISTQB® Gold パートナー",
  },
  { k: "取引先銀行", v: "三井住友銀行、GMOあおぞらネット銀行" },
];

const accessRoutes = [
  "東京メトロ丸ノ内線・半蔵門線・東西線、都営三田線「大手町」駅 徒歩5分",
  "JR線「神田」駅 徒歩7分",
];

const accessAddressLines = [
  "〒101-0047",
  "東京都千代田区内神田1-4-13",
  "THE GATE Otemachi 3階",
];

/** 数字で見る JQIT。すべて会社概要に載せている実データ（推測の数字は入れない） */
const keyFacts = [
  { k: "設立", v: "2024", unit: "年12月", note: "東京・大手町で創業" },
  { k: "従業員数", v: "106", unit: "名", note: "2026年4月時点" },
  { k: "事業", v: "2", unit: "つの事業", note: "ITソリューション／AIソリューション" },
  { k: "情報セキュリティ", v: "ISO/IEC 27001", unit: "", note: "ISMS 認証を取得（2026年3月）" },
];

/** 沿革。ニュースで公表した出来事だけを載せる（日付はニュースの日付。月が分からないものは月を出さない） */
const history: HistoryYear[] = [
  { year: 2024, events: [{ month: 12, text: "株式会社JQIT 設立" }] },
  { year: 2025, events: [{ month: 9, text: "ISTQB® Gold パートナーに認定", href: "/news/wp-1975" }] },
  {
    year: 2026,
    events: [
      { month: 2, text: "経済産業省「DX認定」を取得", href: "/news/wp-2234" },
      { month: 3, text: "労働者派遣事業の許可を取得", href: "/news/wp-2244" },
      { month: 3, text: "ISO/IEC 27001（ISMS）認証を取得", href: "/news/iso27001-isms-20260306" },
      { text: "2026年度 財界 BEST AI 100 に選出" },
      { month: 10, text: "本社を移転", href: "/news/office-relocation-20261007" },
      { month: 10, text: "関東ITソフトウェア健康保険組合に加入", href: "/news/its-kenpo-20261022" },
    ],
  },
];

/** 2つの事業への入口。画像は事業ページと同じもの */
const businessLinks = [
  {
    en: "IT Solutions",
    title: "ITソリューション事業",
    body: "業務システム・アプリの開発、インフラの設計・運用、QA（第三者検証）を、案件に合わせた体制で。",
    href: "/business/it-solutions",
    image: "/business-it-dev.webp",
    alt: "ノートPCとスマートフォンに業務システムの画面が映ったイメージ",
  },
  {
    en: "AI Solutions",
    title: "AIソリューション事業",
    body: "AIエージェント・RAG の開発から、AI の導入支援、自社プロダクト NOVA まで。",
    href: "/business/ai-solutions",
    image: "/business-ai-hero.webp",
    alt: "ロボットがタブレットを持ち、チャット画面のノートPCや書類が並ぶ立体イラスト",
  },
] as const;

const officialSources = [
  {
    label: "ISTQB® Gold パートナー認定",
    organization: "JSTQB（公式パートナー一覧）",
    href: "https://www.jstqb.jp/partnership/",
  },
  {
    label: "労働者派遣事業許可 派13-318536",
    organization: "日本人材派遣協会（新規許可事業所一覧）",
    href: "https://www.jassa.or.jp/wp-content/uploads/2026/03/260301shinki.pdf",
  },
] as const;

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteConfig.url}/about#webpage`,
      url: `${siteConfig.url}/about`,
      name: `会社情報｜${siteConfig.name}`,
      description: pageDescription,
      inLanguage: "ja-JP",
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#organization` },
      mainEntity: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/about#ceo`,
      name: siteConfig.ceo,
      jobTitle: "代表取締役社長",
      image: `${siteConfig.url}/representative-yamada.png`,
      worksFor: { "@id": `${siteConfig.url}/#organization` },
    },
    createBreadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: "会社情報", path: "/about" },
    ]),
  ],
} satisfies Record<string, unknown>;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      {/* 帯の右側で、粒が集まってロゴになる（components/about/LogoParticles.tsx） */}
      <PageHeader title="会社情報" en="About" aside={<LogoParticles />} />
      <SubNav group="Company" items={companySubNav} />

      {/* MESSAGE — 代表写真は署名横の小さなアイコンに留め、メインビジュアルは企業イメージとして扱う */}
      <section id="message" className="bg-paper">
        <div className="relative overflow-hidden">
          <Image
            src="/natural-tech-about.webp"
            alt="自然光の入る空間で事業戦略を議論するJQITのチーム"
            width={1672}
            height={941}
            sizes="100vw"
            data-photo-slide
            className="h-[260px] w-full object-cover object-[58%_45%] min-[720px]:h-[360px]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/25 via-ink/5 to-ink/10"
          />
        </div>
        <Container>
          <FadeIn className="mx-auto max-w-[820px] py-16 min-[720px]:py-[84px]">
            <Kicker className="mb-5">Message</Kicker>
            {/* 見出し → 本文の順に、1文字ずつ打たれるように現れる（components/ui/TypeText.tsx） */}
            <TypeText
              as="h2"
              className="palt text-[28px] font-bold leading-[1.5] tracking-[-0.02em] text-ink min-[720px]:text-[36px]"
              segments={[
                { text: "挑戦と革新で、顧客の" },
                { text: "未来", className: "text-brand" },
                { text: "を切り拓く。" },
              ]}
              interval={70}
              delay={300}
            />
            <div className="mt-9 border-l-2 border-warm pl-6 min-[720px]:pl-8">
              <TypeText
                className="text-[17px] leading-[2.1] text-body min-[720px]:text-[19px] min-[720px]:leading-[1.95]"
                segments={[{ text: "私たちJQITは、技術の力でお客様の“本質的な課題”を解決するITのプロフェッショナル集団です。表面的な要望に応えるだけでなく、その先にある課題の本質を捉え、解決まで伴走する。システム開発からAI活用まで、変化を恐れず挑戦と革新を続けることで、お客様と社会の未来を切り拓いてまいります。" }]}
                interval={26}
                delay={1600}
              />
            </div>
            <div className="mt-10 flex items-center gap-6">
              <Image
                src="/representative-yamada.png"
                alt={`${siteConfig.ceo}の顔写真`}
                width={96}
                height={96}
                className="h-[96px] w-[96px] rounded-full border border-line bg-cream object-cover object-[50%_28%]"
              />
              <p className="flex flex-col gap-1 min-[520px]:flex-row min-[520px]:items-baseline min-[520px]:gap-3.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  代表取締役社長
                </span>
                <span className="palt text-xl font-bold text-ink">{siteConfig.ceo}</span>
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* KEY FACTS — 数字で見る JQIT */}
      <section className="border-t border-line bg-cream py-16 min-[720px]:py-20">
        <Container>
          <FadeIn>
            <Kicker className="mb-8">JQIT at a Glance</Kicker>
            <dl className="about-facts">
              {keyFacts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>
                    <span className="about-facts-v">{f.k === "従業員数" ? <CountUp to={Number(f.v)} /> : f.v}</span>
                    {f.unit && <span className="about-facts-u">{f.unit}</span>}
                    <small>{f.note}</small>
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </Container>
      </section>

      {/* BUSINESS — 2つの事業への入口 */}
      <section className="border-t border-line bg-paper py-20 min-[720px]:py-[92px]">
        <Container>
          <SectionHead kicker="Business" title="事業内容" className="mb-10" />
          <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-2">
            {businessLinks.map((b) => (
              <FadeIn key={b.href}>
                <Link href={b.href} className="about-biz group">
                  <span className="about-biz-img">
                    <Image src={b.image} alt={b.alt} width={1536} height={1024} sizes="(min-width: 900px) 50vw, 100vw" />
                  </span>
                  <span className="mt-6 block font-mono text-[11px] uppercase tracking-[0.18em] text-warm-ink">{b.en}</span>
                  <span className="palt mt-2 flex items-center justify-between gap-4 text-[22px] font-bold tracking-[-0.02em] text-ink transition-colors group-hover:text-warm-ink min-[720px]:text-[24px]">
                    {b.title}
                    <span aria-hidden className="text-[18px] transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                  <span className="mt-3 block text-[14px] leading-[1.95] text-body">{b.body}</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* HISTORY — 沿革 */}
      <section className="border-t border-line bg-paper py-20 min-[720px]:py-[92px]">
        <Container>
          <SectionHead kicker="History" title="沿革" className="mb-12" />
          <HistoryTimeline years={history} />
        </Container>
      </section>

      {/* COMPANY PROFILE */}
      <section className="border-t border-line bg-paper py-20 min-[720px]:py-[92px]">
        <Container>
          <SectionHead kicker="Company Profile" title="会社概要" className="mb-10" />
          <FadeIn className="border-t border-ink">
            {profile.map((row) => (
              <div
                key={row.k}
                className="grid grid-cols-1 items-baseline gap-2 border-b border-line px-2 py-5 min-[720px]:grid-cols-[200px_1fr] min-[720px]:gap-6 min-[720px]:py-[22px]"
              >
                <p className="font-mono text-[11px] tracking-[0.14em] text-muted">{row.k}</p>
                <p className="whitespace-pre-line text-[15px] leading-[1.9] text-ink">{row.v}</p>
              </div>
            ))}
          </FadeIn>
        </Container>
      </section>

      {/* PRIMARY SOURCES — 外部の一次情報で許認可・専門性を検証可能にする */}
      <section className="border-t border-line bg-paper pb-20 min-[720px]:pb-[92px]">
        <Container>
          <FadeIn className="pt-16 min-[720px]:pt-[84px]">
            <Kicker className="mb-4">Official Sources</Kicker>
            <h2 className="palt text-[22px] font-bold tracking-[-0.02em] text-ink min-[720px]:text-[26px]">
              第三者機関で確認できる認定・許可
            </h2>
            <p className="mt-3 max-w-[720px] text-[13.5px] leading-[1.95] text-body">
              当社が掲示する認定・許可のうち、公開されている公式情報へのリンクです。
            </p>
            {/* 認証・認定のマーク（画像のあるもの）。リンクの一覧の上に並べる */}
            <ul className="about-badges" aria-label="認証・認定のマーク">
              {certificationBadges.flatMap((b) =>
                b.image
                  ? [
                      <li key={b.label}>
                        <Image src={b.image.src} alt={b.label} width={b.image.width} height={b.image.height} className="h-auto max-h-[44px] w-auto" />
                        <span>{b.label}</span>
                      </li>,
                    ]
                  : [],
              )}
            </ul>
            {/* 箱にせず、罫線で区切ったリンクの一覧（左に認定名、右に発行元） */}
            <ul className="official-source-list mt-8">
              {officialSources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <span className="palt text-[15px] font-bold leading-[1.7] text-ink transition-colors group-hover:text-warm-ink">
                      {source.label}
                    </span>
                    <span className="shrink-0 text-[12px] leading-[1.7] text-muted">
                      {source.organization} ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>
        </Container>
      </section>

      {/* ACCESS */}
      <section id="access" className="border-t border-line bg-cream py-20 min-[720px]:py-[92px]">
        <Container>
          <SectionHead kicker="Access" title="アクセス" className="mb-10" />
          {/* 箱に入れず、地図（写真と同じく一角だけ曲げる）と、住所・最寄り駅の行を並べる */}
          <FadeIn className="access-layout">
            <div className="access-map photo-curve">
              <iframe
                title={`JQIT本社（${siteConfig.officeName}）周辺のGoogle Map`}
                src={siteConfig.mapEmbedUrl}
                className="absolute inset-0 h-full w-full border-0 grayscale-[15%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="access-info">
              <Kicker className="mb-3">Office</Kicker>
              <p className="mb-6 text-[20px] font-bold tracking-[-0.01em] text-ink min-[720px]:text-[22px]">
                {siteConfig.officeName}
              </p>
              <div className="space-y-8">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-warm-ink">
                    Address
                  </p>
                  <p className="mt-3 text-[15px] font-semibold leading-[1.9] text-ink min-[720px]:text-[17px]">
                    {accessAddressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-warm-ink">
                    Train
                  </p>
                  <ul className="mt-3 space-y-3 text-[14px] leading-[1.9] text-body min-[720px]:text-[15px]">
                    {accessRoutes.map((route) => (
                      <li key={route} className="flex gap-3">
                        <span aria-hidden className="mt-[0.75em] h-1.5 w-1.5 shrink-0 bg-warm" />
                        <span>{route}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <a
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-9 inline-flex w-fit items-center gap-2.5 border-b border-ink pb-1 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-warm hover:text-warm-ink"
              >
                Google Map
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-line bg-cream py-16 min-[720px]:py-20">
        <Container className="relative text-center">
          <FadeIn>
            <h2 className="palt text-[26px] font-bold tracking-[-0.02em] text-ink min-[720px]:text-[34px]">
              JQITについて、もっと知る。
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={siteConfig.links.recruit} external>
                採用情報を見る
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
