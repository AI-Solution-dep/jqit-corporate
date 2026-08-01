import Image from "next/image";
import { NextBusinessBand } from "@/components/business/NextBusinessBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { businessSubNav, SubNav } from "@/components/layout/SubNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceFaq, type ServiceFaqItem } from "@/components/seo/ServiceFaq";
import { Container } from "@/components/ui/Container";
import { DisplayText } from "@/components/ui/DisplayText";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";
import { SectionHead } from "@/components/ui/SectionHead";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata({
  title: "ITソリューション事業",
  description:
    "株式会社JQITのITソリューション事業。受託開発（SI）とSESにより、システム＆アプリ開発・インフラ・QA（第三者検証）をワンストップで提供します。",
  path: "/business/it-solutions",
  image: {
    url: "/natural-tech-it.webp",
    width: 1448,
    height: 1086,
    alt: "自然光の入るオフィスでシステム設計を議論するエンジニア",
  },
});

/** イントロ下の実データストリップ（数値・認証はすべて実在情報） */
const facts = [
  { label: "Members", value: "社員数 106名", note: "2026年4月時点" },
  { label: "Security", value: "ISO/IEC 27001", note: "ISMS認証取得" },
  { label: "QA Partnership", value: "ISTQB® Gold", note: "パートナー" },
];

/** 提供形態: 受託開発（SI）と SES のふたつ */
const models = [
  {
    no: "01",
    en: "SI — System Integration",
    title: "プロジェクトごと、任せる。",
    body: "システム構築の要件定義から運用保守までを一括してお請けする受託開発です。WebアプリケーションやWeb APIをメインとした業務系システムの開発を得意としています。",
    features: [
      "要件定義から運用保守までの一括対応",
      "設計・検証・導入など一部工程からの参画も可能",
      "Web・業務系システム開発が主軸",
    ],
  },
  {
    no: "02",
    en: "SES — Engineering Service",
    title: "チームに、技術を加える。",
    body: "エンジニアがお客様先に常駐し、システム開発・保守・運用を支援するサービスです。常駐により打ち合わせを迅速に行い、スピード感のあるプロジェクト進行を実現します。",
    features: [
      "常駐による迅速な意思疎通とスピード感",
      "業務の拡大・縮小に合わせて必要な期間だけ提供",
      "チーム体制にて技術支援",
    ],
  },
];

/** サービス領域（既存HPの実コンテンツ） */
const fields = [
  {
    no: "01",
    title: "システム＆アプリ開発",
    en: "Development",
    tags: ["Web系", "スマホアプリ", "社内システム"],
    body: "Web系、スマホアプリ、社内システム系などのソフトウェアを要件定義・設計・コーディング・テスト・保守運用まで行います。フロントエンドやサーバサイドのプログラマーはもちろん、システムエンジニアも多数在籍しています。",
  },
  {
    no: "02",
    title: "インフラ（サーバ / ネットワーク）",
    en: "Infrastructure",
    tags: ["ネットワーク", "サーバ", "ミドルウェア", "監視"],
    body: "要件定義からシステムの規模や環境に合わせて、ネットワーク・サーバ・ミドルウェアの導入や企画、設計から運用保守、監視業務まで、ITインフラにかかわる業務を幅広く担います。",
  },
  {
    no: "03",
    title: "QA（第三者検証）",
    en: "Quality Assurance",
    tags: ["第三者検証", "ユーザー観点", "網羅的なテスト・評価"],
    body: "開発者や運用者とは異なる第三者が、設計通りに正しく動作するかをテストし、システムの品質を評価します。不具合やユーザー観点の問題箇所を効率的かつ網羅的に見つけ出し、テスト・評価を繰り返すことでより高品質なシステムを作り上げます。",
  },
];

/** 開発の流れ（一括でも一部工程からでも） */
const steps = [
  { no: "01", title: "要件定義", body: "課題と要望を整理し、システムの要件を定義します。" },
  { no: "02", title: "設計", body: "システムの規模・環境に合わせて設計します。" },
  { no: "03", title: "開発・構築", body: "アプリケーション開発とインフラ構築を進めます。" },
  { no: "04", title: "検証・テスト", body: "第三者の視点で品質をテスト・評価します。" },
  { no: "05", title: "導入・運用保守", body: "リリース後の保守・運用・監視まで担います。" },
];

const strengths = [
  {
    title: "教育体制",
    body: "IT人材の不足が進んでいる市場状況下でも、充実した社員教育と開発経験により、迅速に開発体制を整えることが可能です。それによりお客様へ安定かつ高い品質のサービスを提供し続けています。",
  },
  {
    title: "専門特化",
    body: "システムエンジニアやプログラマーはもちろん、ネットワーク・インフラエンジニアや検証業務に豊富な知識を持つテストエンジニアなど、各専門分野に特化した高い技術力・生産性の体制を構築しています。",
  },
];

/** 旧コーポレートサイトで公開していた、守秘義務に配慮したQA実績 */
const qaProjectExamples = [
  "セキュリティ製品の品質管理",
  "業務系パッケージシステムの検証",
  "次世代携帯端末の検証",
  "駅構内システムの検証",
  "保険システムの検証",
] as const;

const faqs: readonly ServiceFaqItem[] = [
  {
    question: "どのようなシステム開発に対応していますか？",
    answer:
      "Webアプリケーション、Web API、スマートフォンアプリ、社内業務システムを中心に、要件定義・設計・開発・テスト・運用保守まで対応しています。",
  },
  {
    question: "開発工程の一部だけでも依頼できますか？",
    answer:
      "はい。要件定義から運用保守までの一括対応に加え、設計、開発、インフラ構築、第三者検証、運用など、必要な工程のみでもご相談いただけます。",
  },
  {
    question: "受託開発とSESのどちらに対応していますか？",
    answer:
      "どちらにも対応しています。プロジェクト単位でお請けする受託開発と、エンジニアがチームに参画して技術支援するSESから、課題に合う提供形態をご提案します。",
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${siteConfig.url}/business/it-solutions#service`,
      name: "ITソリューション事業",
      description:
        "受託開発（SI）とSESにより、システム・アプリ開発、インフラ、QA・第三者検証をワンストップで提供します。",
      url: `${siteConfig.url}/business/it-solutions`,
      serviceType: ["受託開発", "SES", "インフラ構築", "QA・第三者検証"],
      areaServed: { "@type": "Country", name: "日本" },
      provider: { "@id": `${siteConfig.url}/#organization` },
    },
    createBreadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: "ITソリューション事業", path: "/business/it-solutions" },
    ]),
  ],
} satisfies Record<string, unknown>;

export default function ItSolutionsPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <PageHeader title="ITソリューション事業" en="IT Solutions" />
      <SubNav group="Business" items={businessSubNav} />

      {/* INTRO */}
      <section className="overflow-hidden bg-paper py-20 min-[720px]:py-[96px]">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 min-[1024px]:grid-cols-[1.05fr_0.95fr] min-[1024px]:gap-16">
            <FadeIn>
              <Kicker className="mb-5">System Integration × SES</Kicker>
              <h2 className="palt text-[28px] font-bold leading-[1.45] tracking-[-0.02em] text-ink min-[720px]:text-[38px]">
                要件定義から運用保守まで、
                <br />
                <span className="text-brand">一気通貫</span>で担う。
              </h2>
              <p className="mt-7 max-w-[520px] text-[15px] leading-[2.1] text-body">
                システム構築の要件定義から運用保守までを行う事業です。WebアプリケーションやWeb
                APIなどをメインとした業務系システムの開発を行っています。設計・開発・構築・検証・導入・保守・運用などを一括、または一部からでもお請けします。
              </p>
            </FadeIn>
            <FadeIn className="relative">
              <Image
                src="/natural-tech-it.webp"
                alt="自然光の入るオフィスでシステム設計を議論するエンジニア"
                width={1448}
                height={1086}
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="h-auto w-full rounded-xl object-cover"
              />
              <span
                aria-hidden
                className="absolute -bottom-5 left-6 font-anton text-[72px] leading-none text-brand [text-shadow:0_0_2px_rgba(255,255,255,0.9),0_0_18px_rgba(255,255,255,0.95)] min-[720px]:text-[92px]"
              >
                01
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

      {/* MODELS — ふたつの提供形態 */}
      <section className="relative overflow-hidden border-t border-line bg-cream py-20 min-[720px]:py-[96px]">
        <div className="pointer-events-none absolute -top-3 right-0">
          <DisplayText size="md">ENGAGEMENT</DisplayText>
        </div>
        <Container className="relative">
          <SectionHead
            kicker="Engagement Model"
            title={
              <>
                進め方は、<span className="text-brand">ふたつ</span>。
              </>
            }
            lead="プロジェクトを丸ごと預ける受託開発（SI）と、チームの一員として技術を提供するSES。課題と体制に合わせて選べます。"
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-px border border-line bg-line min-[900px]:grid-cols-2">
            {models.map((m) => (
              <FadeIn
                key={m.no}
                className="brand-line-card bg-white px-8 py-10 min-[720px]:px-10 min-[720px]:py-12"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">
                      {m.en}
                    </p>
                    <h3 className="brand-line-label palt mt-3 text-[24px] font-bold leading-[1.4] tracking-[-0.02em] text-ink min-[720px]:text-[28px]">
                      {m.title}
                    </h3>
                  </div>
                  <span
                    aria-hidden
                    className="brand-line-no font-anton text-[48px] leading-none text-ink/10 min-[720px]:text-[60px]"
                  >
                    {m.no}
                  </span>
                </div>
                <p className="mt-5 text-[14.5px] leading-[2.05] text-body">{m.body}</p>
                <ul className="mt-7 border-t border-line">
                  {m.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-baseline gap-3.5 border-b border-line py-3.5 text-[13.5px] leading-[1.8] text-ink"
                    >
                      <span aria-hidden className="h-px w-4 shrink-0 translate-y-[-3px] bg-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* FIELDS — サービス領域 */}
      <section className="relative overflow-hidden bg-paper py-20 min-[720px]:py-[96px]">
        <Container>
          <SectionHead
            kicker="Service Domain"
            title="サービス領域"
            lead="開発・インフラ・品質保証。システムのライフサイクル全体を、専門特化したエンジニアが支えます。"
            className="mb-4"
          />
          <div>
            {fields.map((f) => (
              <FadeIn
                key={f.no}
                className="brand-line-row group grid grid-cols-1 gap-4 border-b border-line py-9 first:border-t min-[900px]:grid-cols-[120px_1.1fr_1.3fr] min-[900px]:gap-10 min-[900px]:py-11"
              >
                <span
                  aria-hidden
                  className="brand-line-no font-anton text-[44px] leading-[0.9] text-ink/15 transition-colors duration-300 group-hover:text-brand min-[900px]:text-[56px]"
                >
                  {f.no}
                </span>
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {f.en}
                  </p>
                  <h3 className="brand-line-label palt text-[21px] font-bold leading-[1.5] tracking-[-0.01em] text-ink min-[720px]:text-[24px]">
                    {f.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {f.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-card border border-line px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-body"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[14px] leading-[2.05] text-body">{f.body}</p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* EXPERIENCE — 実務経験を検索・AI回答エンジンが抽出しやすい形で提示 */}
      <section className="border-t border-line bg-paper py-20 min-[720px]:py-[92px]">
        <Container>
          <SectionHead
            kicker="Project Experience"
            title="QA・第三者検証のプロジェクト実績"
            lead="守秘義務に配慮し、公開可能な範囲で業種・検証領域のみ掲載しています。"
            className="mb-10"
          />
          <FadeIn>
            <ul className="grid grid-cols-1 gap-px border border-line bg-line min-[720px]:grid-cols-2">
              {qaProjectExamples.map((project, index) => (
                <li
                  key={project}
                  className={`flex items-baseline gap-4 bg-white px-6 py-5 ${
                    index === qaProjectExamples.length - 1
                      ? "min-[720px]:col-span-2"
                      : ""
                  }`}
                >
                  <span className="font-mono text-[11px] font-semibold text-brand">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14px] font-semibold leading-[1.8] text-ink">
                    {project}
                  </span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </Container>
      </section>

      {/* PROCESS — 開発の流れ */}
      <section className="border-t border-line bg-cream py-20 min-[720px]:py-[96px]">
        <Container>
          <SectionHead
            kicker="Process"
            title="開発の流れ"
            lead="すべての工程を一括でも、検証のみ・運用のみといった一部の工程からでもお請けできます。"
            className="mb-12"
          />
          <FadeIn className="grid grid-cols-1 gap-px border border-line bg-line min-[720px]:grid-cols-2 min-[1024px]:grid-cols-5">
            {steps.map((s, i) => (
              <div
                key={s.no}
                className={`brand-line-card relative bg-white px-6 py-7 min-[1024px]:px-5 ${
                  i === steps.length - 1
                    ? "min-[720px]:col-span-2 min-[1024px]:col-span-1"
                    : ""
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="brand-line-no font-mono text-[13px] font-semibold text-brand">
                    {s.no}
                  </span>
                  {/* 矢印は横並び（5カラム）時のみ。縦積みでは視線の流れと矛盾するため隠す */}
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="hidden font-mono text-[13px] text-muted/50 min-[1024px]:inline"
                    >
                      →
                    </span>
                  )}
                </div>
                <h3 className="brand-line-label palt mt-3.5 text-[16px] font-bold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[12.5px] leading-[1.9] text-muted">{s.body}</p>
              </div>
            ))}
          </FadeIn>
        </Container>
      </section>

      {/* STRENGTHS — ダークバンド */}
      <section className="relative overflow-hidden bg-ink py-20 text-white min-[720px]:py-[96px]">
        <div className="pointer-events-none absolute -bottom-2 right-0 min-[720px]:-bottom-4">
          <DisplayText tone="white">STRENGTH</DisplayText>
        </div>
        <Container className="relative">
          <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
            <span aria-hidden className="h-px w-6 bg-brand" />
            Our Strengths
          </p>
          <h2 className="palt text-[28px] font-bold leading-[1.4] tracking-[-0.02em] min-[720px]:text-[36px]">
            選ばれ続ける、理由。
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-px border border-white/15 bg-white/15 min-[900px]:grid-cols-2">
            {strengths.map((s) => (
              <FadeIn key={s.title} className="bg-ink px-8 py-9 min-[720px]:px-10 min-[720px]:py-11">
                <h3 className="palt text-[20px] font-bold leading-[1.5]">{s.title}</h3>
                <p className="mt-4 text-[14px] leading-[2.1] text-white/75">{s.body}</p>
              </FadeIn>
            ))}
          </div>
          <p className="mt-8 font-mono text-[11px] tracking-[0.12em] text-white/50">
            ISO/IEC 27001（ISMS）／ ISTQB® Gold パートナー ／ DX認定
          </p>
        </Container>
      </section>

      <ServiceFaq items={faqs} />

      {/* NEXT — AIソリューション事業へ */}
      <NextBusinessBand
        no="02"
        en="AI Solutions"
        title="AIソリューション事業"
        href="/business/ai-solutions"
        image="/natural-tech-ai.webp"
        alt="AIデータ可視化を前に分析するメンバー"
      />

    </>
  );
}
