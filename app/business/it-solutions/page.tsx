import Image from "next/image";
import { NextBusinessBand } from "@/components/business/NextBusinessBand";
import { DevScreens, InfraScreens, QaScreens } from "@/components/business/ScreenMocks";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeadsLine } from "@/components/business/FieldLead";
import { ConsultLine } from "@/components/layout/ConsultLine";
import { businessSubNav, SubNav } from "@/components/layout/SubNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceFaq, type ServiceFaqItem } from "@/components/seo/ServiceFaq";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";
import { SectionHead } from "@/components/ui/SectionHead";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata({
  title: "法人向けSES・受託開発・QAのITソリューション",
  description:
    "法人向けにSES（システムエンジニアリングサービス）でのエンジニア常駐・準委任、業務システムの受託開発、インフラ構築、QA（第三者検証）を提供します。ご依頼の業務範囲に応じた体制を編成し、必要な期間・工程だけでも対応します。労働者派遣事業許可（派13-318536）、ISO/IEC 27001認証取得。",
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

/** サービス領域（既存HPの実コンテンツ） */
const fields = [
  {
    id: "development",
    title: "システム＆アプリ開発",
    en: "Development",
    screens: DevScreens,
    stack: "Kotlin · Swift · Java · TypeScript · React · Next.js",
    tags: ["Web系", "スマホアプリ", "社内システム"],
    can: ["スマートフォンアプリ（iOS・Android）の開発", "Webアプリケーション・Web API の開発", "既存システムの改修・保守"],
    body: "Web系、スマホアプリ、社内システム系などのソフトウェアを要件定義・設計・コーディング・テスト・保守運用まで行います。フロントエンドやサーバサイドのプログラマーはもちろん、システムエンジニアも多数在籍しています。",
  },
  {
    id: "infrastructure",
    title: "インフラ（サーバ / ネットワーク）",
    en: "Infrastructure",
    screens: InfraScreens,
    stack: "AWS · Linux · Network · Middleware · Monitoring",
    tags: ["ネットワーク", "サーバ", "ミドルウェア", "監視"],
    can: ["AWS・Linux 環境の設計・構築", "ネットワーク・ミドルウェアの導入", "運用保守・監視"],
    body: "要件定義からシステムの規模や環境に合わせて、ネットワーク・サーバ・ミドルウェアの導入や企画、設計から運用保守、監視業務まで、ITインフラにかかわる業務を幅広く担います。",
  },
  {
    id: "qa",
    title: "QA（第三者検証）",
    en: "Quality Assurance",
    screens: QaScreens,
    stack: "Test Planning · Playwright · Mobile Devices",
    tags: ["第三者検証", "ユーザー観点", "網羅的なテスト・評価"],
    can: ["テスト計画・テスト管理", "テスト自動化（Playwright）", "ユーザー観点での評価"],
    body: "開発者や運用者とは異なる第三者が、設計通りに正しく動作するかをテストし、システムの品質を評価します。不具合やユーザー観点の問題箇所を効率的かつ網羅的に見つけ出し、テスト・評価を繰り返すことでより高品質なシステムを作り上げます。",
  },
];

/** 実績のある技術領域（会社・案件単位ではなく、技術・対象の領域で。2026-11-18 オーナー確認。経験の多いものから順に） */
const techAreas = [
  { label: "業界", en: "Industries", items: ["金融", "物流", "メーカー"], lead: true },
  { label: "開発", en: "Development", items: ["スマートフォンアプリ", "Webアプリケーション", "Web API", "社内業務システム", "業務系パッケージ"] },
  { label: "言語・フレームワーク", en: "Languages", items: ["Kotlin", "Swift", "Java", "Python", "TypeScript", "React", "Next.js"] },
  { label: "クラウド・インフラ", en: "Cloud & Infra", items: ["AWS", "Linux", "ネットワーク", "サーバ", "ミドルウェア", "運用監視"] },
  {
    label: "品質保証",
    en: "Quality",
    items: [
      "テスト計画",
      "テスト管理",
      "テスト自動化（Playwright）",
      "第三者検証",
      "セキュリティ製品の品質管理",
      "モバイル端末の検証",
      "交通系（駅構内）システムの検証",
      "保険システムの検証",
    ],
  },
];

/** 開発の流れ（一括でも一部工程からでも） */
const steps = [
  { title: "要件定義", body: "課題と要望を整理し、システムの要件を定義します。" },
  { title: "設計", body: "システムの規模・環境に合わせて設計します。" },
  { title: "開発・構築", body: "アプリケーション開発とインフラ構築を進めます。" },
  { title: "検証・テスト", body: "第三者の視点で品質をテスト・評価します。" },
  { title: "導入・運用保守", body: "リリース後の保守・運用・監視まで担います。" },
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

const faqs: readonly ServiceFaqItem[] = [
  {
    question: "SESとは何ですか？",
    answer:
      "SESは System Engineering Service（システムエンジニアリングサービス）の略で、エンジニアがお客様のプロジェクトに参画し、技術力を提供する契約形態です。成果物の完成を約束する請負契約とは異なり、業務の遂行に対して報酬をお支払いいただきます。指揮命令はエンジニアの所属元である当社が行います。",
  },
  {
    question: "SESと受託開発、労働者派遣はどう違いますか？",
    answer:
      "受託開発（請負）は成果物の完成に責任を負い、SESは業務の遂行に対して報酬が発生します。労働者派遣はお客様がエンジニアへ直接指揮命令を行う点が異なります。当社は労働者派遣事業許可（派13-318536）を取得しており、ご要望に応じた契約形態でご提案します。",
  },
  {
    question: "参画するのは自社の社員ですか？協力会社やフリーランスですか？",
    answer:
      "自社に在籍する社員が参画します。社員数は106名（2026年4月時点）です。案件の内容によっては協力会社との連携をご提案する場合がありますが、その際は事前に所属と商流を明示します。",
  },
  {
    question: "商流は何次請けになりますか？",
    answer:
      "お客様と当社の直接契約を基本としています。商流が発生する場合は、ご提案時に構造を明示します。",
  },
  {
    question: "参画するエンジニアが合わなかった場合、交代はできますか？",
    answer:
      "対応可能です。参画後も所属元として稼働状況をフォローし、ミスマッチが生じた場合は引き継ぎ期間を設けたうえで体制の見直しをご提案します。",
  },
  {
    question: "小規模な依頼でも対応できますか？",
    answer:
      "対応可能です。ご依頼いただく業務の範囲に応じて、当社が体制を編成します。単一の工程を担当する小規模な体制から、リーダーを置いたチーム体制まで対応します。開発・インフラ・QAを組み合わせた体制も可能です。",
  },
  {
    question: "リモートでの参画は可能ですか？",
    answer:
      "案件の内容とお客様のセキュリティ要件に応じて、常駐・リモート・併用のいずれも対応可能です。常駐の場合は打ち合わせを迅速に行える点が利点です。",
  },
  {
    question: "どのようなシステム開発に対応していますか？",
    answer:
      "Webアプリケーション、Web API、スマートフォンアプリ、社内業務システムを中心に、要件定義・設計・開発・テスト・運用保守まで対応しています。",
  },
  {
    question: "開発工程の一部だけでも依頼できますか？",
    answer:
      "対応可能です。要件定義から運用保守までの一括対応に加え、設計、開発、インフラ構築、第三者検証、運用など、必要な工程のみでも承ります。",
  },
  {
    question: "要件が固まっていない段階でも相談できますか？",
    answer:
      "対応可能です。課題と要望の整理から着手し、システムの要件を一緒に定義するところから対応します。",
  },
  {
    question: "納品後の保守・運用まで対応してもらえますか？",
    answer:
      "対応しています。リリース後の保守、運用、監視までを含めてお請けします。運用のみでも対応可能です。",
  },
  {
    question: "セキュリティ体制はどうなっていますか？",
    answer:
      "ISO/IEC 27001（ISMS）認証を取得しています。あわせて経済産業省のDX認定、労働者派遣事業許可（派13-318536）を取得しています。参画時の秘密保持契約、セキュリティ教育、端末の取り扱いについても、ご要望に応じて対応します。",
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
        "SESと受託開発（SI）により、システム・アプリ開発、インフラ、QA・第三者検証をワンストップで提供します。",
      url: `${siteConfig.url}/business/it-solutions`,
      serviceType: ["SES", "受託開発", "インフラ構築", "QA・第三者検証"],
      areaServed: { "@type": "Country", name: "日本" },
      provider: { "@id": `${siteConfig.url}/#organization` },
    },
    // カテゴリ単位でも認識されるよう、章ごとに Service を分けて宣言する
    {
      "@type": "Service",
      "@id": `${siteConfig.url}/business/it-solutions#ses`,
      name: "SES（システムエンジニアリングサービス）",
      alternateName: ["システムエンジニアリングサービス", "System Engineering Service"],
      description:
        "エンジニアがお客様のプロジェクトに常駐・準委任で参画し、システム開発・インフラ構築・QA（第三者検証）を技術支援する法人向けサービスです。ご依頼の業務範囲に応じて体制を編成します。",
      url: `${siteConfig.url}/business/it-solutions#ses`,
      serviceType: [
        "SES",
        "システムエンジニアリングサービス",
        "エンジニア常駐支援",
        "準委任契約による技術支援",
      ],
      areaServed: { "@type": "Country", name: "日本" },
      provider: { "@id": `${siteConfig.url}/#organization` },
      isRelatedTo: { "@id": `${siteConfig.url}/business/it-solutions#contract-development` },
    },
    {
      "@type": "Service",
      "@id": `${siteConfig.url}/business/it-solutions#contract-development`,
      name: "受託開発（SI）",
      alternateName: ["システム受託開発", "請負開発", "System Integration"],
      description:
        "業務システムの要件定義から設計・開発・テスト・運用保守までを一括してお請けする受託開発です。一部工程のみでも対応します。",
      url: `${siteConfig.url}/business/it-solutions#contract-development`,
      serviceType: [
        "受託開発",
        "業務システム開発",
        "Webアプリケーション開発",
        "システムインテグレーション",
      ],
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
            <FadeIn className="photo-curve biz-hero-photo relative overflow-hidden">
              <Image
                src="/natural-tech-it.webp"
                alt="自然光の入るオフィスでシステム設計を議論するエンジニア"
                width={1448}
                height={1086}
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                data-photo-slide
                className="h-auto w-full object-cover"
              />
            </FadeIn>
          </div>

          {/* 実データストリップ */}
          <FadeIn className="biz-facts mt-14 grid grid-cols-1 border-t border-ink min-[1024px]:grid-cols-3">
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

      {/* WHAT WE DO — できること。契約の形（SES／受託）で分けず、開発・インフラ・品質保証の3つで見せる。
          進め方（一括でも、必要な工程・期間だけでも）は導入文に一言で。
          #ses / #contract-development は TOP などからのリンク先なので、この節に残す */}
      <section id="ses" className="scroll-mt-24 border-t border-line bg-cream py-20 min-[720px]:py-[96px]">
        <span id="contract-development" className="block scroll-mt-24" aria-hidden />
        <Container>
          <SectionHead
            kicker="What We Do"
            title={
              <>
                開発・インフラ・QAを、
                <br />
                <span className="text-brand">ひとつのチーム</span>で。
              </>
            }
            lead="システムの開発・インフラ・品質保証を、要件定義から運用保守まで。一括でも、必要な工程・期間だけでも、チームでお請けします。"
            className="mb-4"
          />
          {/* 誰が見るのかは、ここで3人まとめて1回だけ出す（領域ごとに繰り返さない） */}
          <FadeIn className="mt-8">
            <LeadsLine leaders={["development", "infrastructure", "qa"]} />
          </FadeIn>
          {/* 領域ごとに、文章と「作る物」の画面モックを左右に並べる（画面は架空のイメージ） */}
          <div className="mt-10">
            {fields.map((f) => (
              <FadeIn key={f.en} id={f.id} className="biz-row scroll-mt-24">
                <div>
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-warm-ink">{f.en}</p>
                  <h3 className="palt text-[22px] font-bold leading-[1.5] tracking-[-0.01em] text-ink min-[720px]:text-[26px]">
                    {f.title}
                  </h3>
                  <p className="mt-4 text-[14px] leading-[2.05] text-body">{f.body}</p>
                  <ul className="biz-points">
                    {f.can.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p className="mt-4 font-mono text-[11.5px] tracking-[0.06em] text-muted">{f.stack}</p>
                </div>
                <f.screens />
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* EXPERIENCE — 実績は会社・案件ではなく、経験のある技術領域で。会社概要と同じ「項目｜内容」の表 */}
      <section className="border-t border-line bg-paper py-20 min-[720px]:py-[92px]">
        <Container>
          <SectionHead
            kicker="Experience"
            title={
              <>
                実績のある<span className="text-brand">技術領域</span>
              </>
            }
            lead="これまでに担当してきた技術・対象の領域です。守秘義務に配慮し、お客様名・案件名は掲載していません。"
            className="mb-10"
          />
          <FadeIn>
            <dl className="tech-table">
              {techAreas.map((area) => (
                <div key={area.label}>
                  <dt>
                    {area.label}
                    <small>{area.en}</small>
                  </dt>
                  <dd className={area.lead ? "is-lead palt" : "palt"}>
                    {area.items.map((it) => (
                      <span key={it}>{it}</span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[12.5px] text-muted">画面はいずれも説明用のイメージです。</p>
          </FadeIn>
        </Container>
      </section>

      {/* PROCESS — 開発の流れ。番号や円は使わず、左から右へ読む5列 */}
      <section className="border-t border-line bg-cream py-20 min-[720px]:py-[96px]">
        <Container>
          <SectionHead
            kicker="Process"
            title="開発の流れ"
            lead="すべての工程を一括でも、検証のみ・運用のみといった一部の工程からでもお請けできます。"
            className="mb-10"
          />
          <FadeIn>
            <ol className="flow-steps">
              {steps.map((s) => (
                <li key={s.title}>
                  <h3 className="palt">{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </FadeIn>
        </Container>
      </section>

      {/* STRENGTHS — ダークバンド */}
      <section className="relative overflow-hidden bg-ink py-20 text-white min-[720px]:py-[96px]">
        <Container className="relative">
          <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-warm">
            <span aria-hidden className="h-px w-6 bg-warm" />
            Our Strengths
          </p>
          <h2 className="palt text-[28px] font-bold leading-[1.4] tracking-[-0.02em] min-[720px]:text-[36px]">
            選ばれ続ける、理由。
          </h2>
          {/* 箱や円にせず、大きな見出しと短い文の2段で見せる */}
          <div className="strength-cols">
            {strengths.map((st) => (
              <FadeIn key={st.title} className="strength-col">
                <h3 className="palt text-[26px] font-bold leading-[1.4] min-[720px]:text-[32px]">{st.title}</h3>
                <p className="mt-4 text-[14px] leading-[2.05] text-white/78">{st.body}</p>
              </FadeIn>
            ))}
          </div>
          <ul className="strength-certs" aria-label="認証・パートナー">
            {["ISO/IEC 27001（ISMS）", "ISTQB® Gold パートナー", "DX認定"].map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Container>
      </section>

      <ServiceFaq items={faqs} />

      <ConsultLine text="開発・インフラ・QAのご相談は、お問い合わせフォームから承ります。" />


      {/* NEXT — AIソリューション事業へ */}
      <NextBusinessBand
        en="AI Solutions"
        title="AIソリューション事業"
        href="/business/ai-solutions"
        image="/natural-tech-ai.webp"
        alt="AIデータ可視化を前に分析するメンバー"
      />

    </>
  );
}
