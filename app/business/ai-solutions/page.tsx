import Image from "next/image";
import { NextBusinessBand } from "@/components/business/NextBusinessBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { businessSubNav, SubNav } from "@/components/layout/SubNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceFaq, type ServiceFaqItem } from "@/components/seo/ServiceFaq";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DisplayText } from "@/components/ui/DisplayText";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";
import { SectionHead } from "@/components/ui/SectionHead";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata({
  title: "AIソリューション事業",
  description:
    "株式会社JQITのAIソリューション事業。AIシステムの受託開発、AI導入支援・AI推進コンサル、AIサービス開発で企業のAI活用を支援します。",
  path: "/business/ai-solutions",
  image: {
    url: "/natural-tech-ai.webp",
    width: 1448,
    height: 1086,
    alt: "AIデータ可視化を前に分析するJQITのメンバー",
  },
});

/** イントロ下の実データストリップ（すべて実在情報） */
const facts = [
  { label: "Recognition", value: "財界 BEST AI 100", note: "2026年度" },
  { label: "Certification", value: "DX認定", note: "経済産業省" },
  { label: "Product", value: "NOVA", note: "SES管理システム" },
];

/** 提供サービス */
const services = [
  {
    no: "01",
    en: "AI Development",
    title: "AIシステムの受託開発事業",
    lead: "生成AIやAIエージェントを組み込んだ業務システム・アプリケーションを、要件整理から設計・開発・運用まで一気通貫で開発します。",
    items: [
      {
        head: "AIシステム・アプリケーション開発",
        body: "チャットボット、RAG、AIエージェント、社内業務アプリなど、実務で使えるAIシステムを開発します。",
      },
      {
        head: "独自データ活用・RAG構築",
        body: "社内文書や業務データを活用し、検索・回答・判断支援に使えるRAGシステムを構築します。",
      },
    ],
  },
  {
    no: "02",
    en: "AI Enablement",
    title: "AI導入支援・AI推進コンサル事業",
    lead: "AIエージェントの導入支援を中心に、業務自動化・効率化を内製化して実現していくための伴走支援を行います。",
    items: [
      {
        head: "AIエージェント導入支援",
        body: "業務フローに合わせてAIエージェントの活用領域を設計し、導入・検証・定着まで伴走します。",
      },
      {
        head: "業務自動化・効率化の内製化支援",
        body: "現場が自走して改善を続けられるよう、業務整理、活用ルール、運用設計、社内展開まで支援します。",
      },
    ],
    tags: ["AIエージェント", "業務自動化", "内製化支援", "AI推進体制"],
  },
  {
    no: "03",
    en: "AI Product",
    title: "AIサービス開発",
    lead: "NOVAをはじめとしたAIサービスの企画・開発を通じて、現場の生産性を高めるプロダクトを継続的に生み出します。",
    items: [
      {
        head: "NOVA",
        body: "SES営業のAIマッチングと一元管理を実現する、当社開発のAIプロダクトです。",
      },
      {
        head: "AIサービス企画・開発",
        body: "自社で得た業務知見とAI開発力をもとに、新しいAIサービスを企画・検証・開発します。",
      },
    ],
  },
];

/** NOVA が一元管理する領域（製品の実機能） */
const novaFeatures = ["AIマッチング", "社員管理", "人材管理", "案件管理", "契約管理"];

const faqs: readonly ServiceFaqItem[] = [
  {
    question: "どのようなAIシステムを開発できますか？",
    answer:
      "生成AIを活用したチャットボット、RAG、AIエージェント、社内業務アプリなどを、要件整理から設計・開発・運用まで一気通貫で開発します。",
  },
  {
    question: "AI導入の検討段階から相談できますか？",
    answer:
      "はい。業務フローと課題を整理し、AIの活用領域の選定、導入検証、運用設計、社内展開、定着まで伴走します。",
  },
  {
    question: "社内でAI活用を内製化する支援もできますか？",
    answer:
      "対応しています。現場が自走して改善を続けられるよう、業務整理、活用ルール、推進体制、運用設計、人材育成を含めて支援します。",
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${siteConfig.url}/business/ai-solutions#service`,
      name: "AIソリューション事業",
      description:
        "AIシステムの受託開発、AI導入支援・AI推進コンサル、AIサービス開発を通じて企業のAI活用を支援します。",
      url: `${siteConfig.url}/business/ai-solutions`,
      serviceType: ["AIシステム受託開発", "AI導入支援", "AI推進コンサル", "AIサービス開発"],
      areaServed: { "@type": "Country", name: "日本" },
      provider: { "@id": `${siteConfig.url}/#organization` },
    },
    createBreadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: "AIソリューション事業", path: "/business/ai-solutions" },
    ]),
  ],
} satisfies Record<string, unknown>;

export default function AiSolutionsPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <PageHeader title="AIソリューション事業" en="AI Solutions" />
      <SubNav group="Business" items={businessSubNav} />

      {/* INTRO */}
      <section className="overflow-hidden bg-paper py-20 min-[720px]:py-[96px]">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 min-[1024px]:grid-cols-[1.05fr_0.95fr] min-[1024px]:gap-16">
            <FadeIn>
              <Kicker className="mb-5">AI Solutions</Kicker>
              <h2 className="palt text-[28px] font-bold leading-[1.45] tracking-[-0.02em] text-ink min-[720px]:text-[38px]">
                受託開発から導入推進、サービス開発まで。
                <br />
                <span className="text-brand">AI活用</span>を、全面支援。
              </h2>
              <p className="mt-7 max-w-[520px] text-[15px] leading-[2.1] text-body">
                AIシステムの受託開発、AI導入支援・AI推進コンサル、AIサービス開発の3つの領域で、企業のAI活用を支援します。大規模言語モデルやAIエージェントを中心に、導入の伴走から自社サービス開発まで一貫して対応します。
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {["AI受託開発", "AIエージェント導入", "業務自動化", "内製化支援", "NOVA"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-card border border-line px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-body"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            </FadeIn>
            <FadeIn className="relative">
              <Image
                src="/natural-tech-ai.webp"
                alt="AIデータ可視化を前に分析するメンバー"
                width={1448}
                height={1086}
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="h-auto w-full rounded-xl object-cover"
              />
              <span
                aria-hidden
                className="absolute -bottom-5 right-6 font-anton text-[72px] leading-none text-brand [text-shadow:0_0_2px_rgba(255,255,255,0.9),0_0_18px_rgba(255,255,255,0.95)] min-[720px]:text-[92px]"
              >
                02
              </span>
            </FadeIn>
          </div>

          {/* 実データストリップ */}
          <FadeIn className="mt-14 grid grid-cols-1 border-t border-ink min-[1024px]:grid-cols-3">
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-4 border-b border-line py-5 min-[1024px]:block min-[1024px]:border-b-0 min-[1024px]:border-r min-[1024px]:px-6 min-[1024px]:first:pl-0 min-[1024px]:last:border-r-0"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {f.label}
                </p>
                <p className="min-[1024px]:mt-2.5">
                  <span className="palt text-[19px] font-bold text-ink min-[1024px]:text-[22px]">
                    {f.value}
                  </span>
                  <span className="ml-2.5 font-mono text-[10.5px] tracking-[0.06em] text-muted">
                    {f.note}
                  </span>
                </p>
              </div>
            ))}
          </FadeIn>
        </Container>
      </section>

      {/* SERVICES — 提供サービス */}
      <section className="relative overflow-hidden border-t border-line bg-cream py-20 min-[720px]:py-[96px]">
        <div className="pointer-events-none absolute -top-3 right-0">
          <DisplayText size="md">SERVICES</DisplayText>
        </div>
        <Container className="relative">
          <SectionHead
            kicker="Service"
            title={
              <>
                <span className="text-brand">3つの領域</span>で、AI活用を支える。
              </>
            }
            lead="AIシステムの受託開発、AI導入・推進の伴走、自社AIサービスの開発。企業のAI活用を実装と運用の両面から支援します。"
            className="mb-4"
          />
          <div>
            {services.map((s) => (
              <FadeIn
                key={s.no}
                className="brand-line-row group grid grid-cols-1 gap-5 border-b border-line py-10 first:border-t min-[900px]:grid-cols-[120px_1.05fr_1.35fr] min-[900px]:gap-10 min-[900px]:py-12"
              >
                <span
                  aria-hidden
                  className="brand-line-no font-anton text-[44px] leading-[0.9] text-ink/15 transition-colors duration-300 group-hover:text-brand min-[900px]:text-[56px]"
                >
                  {s.no}
                </span>
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {s.en}
                  </p>
                  <h3 className="brand-line-label palt text-[21px] font-bold leading-[1.5] tracking-[-0.01em] text-ink min-[720px]:text-[24px]">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-[14px] leading-[2.05] text-body">{s.lead}</p>
                  {s.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-card border border-line px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-body"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className={`grid grid-cols-1 gap-px self-start border border-line bg-line ${
                    s.items.length > 1 ? "min-[600px]:grid-cols-2" : ""
                  }`}
                >
                  {s.items.map((item) => (
                    <div
                      key={item.head}
                      className="brand-line-card bg-white px-6 py-6 min-[720px]:px-7"
                    >
                      <h4 className="brand-line-label palt flex items-baseline gap-3 text-[15px] font-bold text-ink">
                        <span aria-hidden className="h-px w-4 shrink-0 translate-y-[-3px] bg-brand" />
                        {item.head}
                      </h4>
                      <p className="mt-2.5 text-[13px] leading-[1.95] text-muted">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* NOVA — 自社プロダクト */}
      <section className="relative overflow-hidden bg-ink py-20 text-white min-[720px]:py-[100px]">
        <div className="pointer-events-none absolute -bottom-2 right-0 min-[720px]:-bottom-4">
          <DisplayText tone="white">NOVA</DisplayText>
        </div>
        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-12 min-[1024px]:grid-cols-[1fr_1fr] min-[1024px]:gap-16">
            <FadeIn>
              <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                <span aria-hidden className="h-px w-6 bg-brand" />
                Our Product
              </p>
              <h2 className="palt text-[28px] font-bold leading-[1.45] tracking-[-0.02em] min-[720px]:text-[36px]">
                AIマッチング×一元管理で、
                <br />
                SES営業の生産性向上を支援。
              </h2>
              <p className="mt-6 text-[14.5px] leading-[2.05] text-white/80">
                NOVAは、当社のAI開発力を注ぎ込んだSES事業特化の管理システムです。生成AIを活用したマッチング機能により、SES営業未経験でも高精度なマッチングを実現。SES事業に必要な情報を一元管理します。
              </p>
              <div className="mt-8 grid grid-cols-2 gap-px border border-white/15 bg-white/15 min-[600px]:grid-cols-3">
                {novaFeatures.map((f, i) => (
                  <div key={f} className="bg-ink px-4 py-3.5">
                    <p className="font-mono text-[10px] text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="palt mt-1 text-[13.5px] font-bold">{f}</p>
                  </div>
                ))}
                <div className="flex min-h-[64px] items-center bg-ink px-4 py-3.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                    All in One
                  </p>
                </div>
              </div>
              <div className="mt-9">
                <Button href={siteConfig.links.nova} external>
                  NOVA 製品サイトへ
                </Button>
              </div>
            </FadeIn>
            <FadeIn>
              <Image
                src="/nova-product.png"
                alt="NOVAの管理画面"
                width={748}
                height={438}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-auto w-full rounded-xl border border-white/10 object-cover"
              />
            </FadeIn>
          </div>
        </Container>
      </section>

      <ServiceFaq items={faqs} />

      {/* NEXT — ITソリューション事業へ */}
      <NextBusinessBand
        no="01"
        en="IT Solutions"
        title="ITソリューション事業"
        href="/business/it-solutions"
        image="/natural-tech-it.webp"
        alt="自然光の入るオフィスでシステム設計を議論するエンジニア"
      />

    </>
  );
}
