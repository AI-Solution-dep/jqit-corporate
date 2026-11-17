import { PageHeader } from "@/components/layout/PageHeader";
import { companySubNav, SubNav } from "@/components/layout/SubNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHead } from "@/components/ui/SectionHead";
import { createPageMetadata, createWebPageJsonLd } from "@/lib/seo";

const pageDescription =
  "株式会社JQITのビジョンと戦略。企業理念・6つの行動指針・DX戦略と成果指標・推進体制をご紹介します。";

export const metadata = createPageMetadata({
  title: "ビジョンと戦略",
  description: pageDescription,
  path: "/corporate-vision",
});

const visionJsonLd = createWebPageJsonLd({
  name: "ビジョンと戦略｜株式会社JQIT",
  description: pageDescription,
  path: "/corporate-vision",
  breadcrumbs: [
    { name: "ホーム", path: "/" },
    { name: "ビジョンと戦略", path: "/corporate-vision" },
  ],
});

const philosophy = [
  {
    en: "Purpose",
    title: "成長機会の最大化と社会への貢献",
  },
  {
    en: "Mission",
    title: "課題の“本質”を捉える伴走者",
  },
  {
    en: "Vision",
    title: "“プロ”としての自律性とオーナーシップ",
  },
];

const values = [
  {
    title: "顧客中心",
    body: "常に顧客視点に立ち、お客様にとって真に価値のあるサービスを創造し提供する。",
  },
  {
    title: "デジタル化社会への貢献",
    body: "デジタル化を推進し、新たな価値創造を通じて社会の持続的発展に貢献する。",
  },
  {
    title: "技術探求と挑戦",
    body: "常に最新の技術を探求し、従来の枠を超えた革新的なソリューションに挑戦し続ける。",
  },
  {
    title: "学びと自己実現",
    body: "社員一人ひとりが学び続ける姿勢を持ち、常に最善を尽くすことで、自己成長と自己実現をはかる。",
  },
  {
    title: "利他の精神",
    body: "自己利益よりも他者の利益を優先し、共に成長する共生の文化を育む。",
  },
  {
    title: "人的資本を育てる文化",
    body: "従業員が安心して働き、成長できる環境を整え、従業員の意見を積極的に聞き取り、反映させることで、企業と従業員双方にとってより良い状態を目指す。",
  },
];

const dxKpis = [
  {
    no: "01",
    title: "社内業務の生産性向上",
    items: [
      { label: "事務工数削減率", target: "2025年度までに ▲40％" },
      { label: "クラウド基盤移行率", target: "2025年度末までに主要業務 100％移行" },
      { label: "AIマッチングシステム導入率", target: "2025年度末までに 70％以上" },
    ],
  },
  {
    no: "02",
    title: "経営革新・データ活用",
    items: [
      { label: "データ基盤稼働率", target: "2025年度中に 100％" },
      { label: "AI分析モデル稼働数", target: "2025年度末までに 2モデル以上" },
      { label: "経営判断支援ダッシュボード活用回数", target: "月次提出 100％" },
    ],
  },
];

const structure = [
  {
    title: "AIソリューション事業部を編成",
    body: "全社DX戦略の司令塔として「AIソリューション事業部」を設立。DX戦略の立案・推進、データ基盤の構築・管理、組織横断的な業務改善を主導し、社内変革と外部への価値提供を同時に実現します。",
  },
  {
    title: "人材育成の強化",
    body: "最新技術の実践的習得機会の創出、資格取得支援制度の拡充（AI・データ分析・クラウド分野）、外部技術コミュニティとの連携強化により、DXを推進する高度人材を組織的に育成します。",
  },
];

export default function CorporateVisionPage() {
  return (
    <>
      <JsonLd data={visionJsonLd} />
      <PageHeader title="ビジョンと戦略" en="Vision" />
      <SubNav group="Company" items={companySubNav} />

      {/* 企業理念 */}
      <section data-depth-scene="route" className="bg-paper py-20 min-[720px]:py-[92px]">
        <Container>
          <SectionHead kicker="Philosophy" title="企業理念" className="mb-10" />
          <FadeIn className="max-w-[860px]">
            <p className="vision-statement palt text-[26px] font-bold leading-[1.6] tracking-[-0.02em] text-ink min-[720px]:text-[34px]">
              『挑戦と革新で、顧客の<span className="text-brand">未来</span>
              を切り拓く。』
            </p>
            <p className="mt-6 text-[15px] leading-[2.1] text-body">
              私たちは、デジタル技術の力で顧客と社会に新たな価値を創造し、持続可能な未来の実現に貢献します。
            </p>
          </FadeIn>
          <div className="vision-philosophy mt-16">
            {philosophy.map((p) => (
              <FadeIn key={p.en} className="vision-philosophy-row">
                <p className="text-[15px] font-semibold text-brand">{p.en}</p>
                <h3 className="palt text-[22px] font-bold leading-[1.65] text-ink min-[900px]:text-[28px]">
                  {p.title}
                </h3>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* 6つの行動指針 */}
      <section data-depth-scene="route" className="border-t border-line bg-cream py-20 min-[720px]:py-[88px]">
        <Container className="vision-values-layout">
          <div className="vision-values-intro">
            <SectionHead
              kicker="Value"
              title="6つの行動指針"
              lead="当社は以下の6つの行動指針を軸に、事業活動を推進してまいります。"
            />
          </div>
          <dl className="vision-values">
            {values.map((v) => (
              <FadeIn key={v.title} className="vision-value">
                <dt className="palt text-[24px] font-bold leading-[1.6] tracking-[-0.02em] text-ink min-[900px]:text-[30px]">
                  {v.title}
                </dt>
                <dd className="mt-5 text-[15px] leading-[2.15] text-body">{v.body}</dd>
              </FadeIn>
            ))}
          </dl>
        </Container>
      </section>

      {/* DX戦略と成果指標 */}
      <section className="bg-paper py-20 min-[720px]:py-[92px]">
        <Container>
          <SectionHead
            kicker="DX Strategy"
            title="DX戦略と成果指標"
            lead="当社は以下の柱でDXを推進し、社内変革と新たな価値創造を実現します。"
            className="mb-10"
          />
          <FadeIn className="max-w-[860px] border-l-2 border-brand pl-6 min-[720px]:pl-8">
            <h3 className="palt text-[19px] font-bold leading-[1.6] text-ink">
              データ活用による経営革新
            </h3>
            <p className="mt-3 text-[14.5px] leading-[2.05] text-body">
              2025年度中に業務基幹システムを刷新し、AI機能を搭載したデータ基盤を構築。営業データと経営データの精度向上と連携強化により、迅速かつ的確な経営判断を可能にします。
            </p>
          </FadeIn>
          <div className="mt-16 space-y-14">
            {dxKpis.map((kpi) => (
              <FadeIn key={kpi.no} className="vision-kpi">
                <h3 className="palt text-[22px] font-bold leading-[1.6] text-ink">{kpi.title}</h3>
                <dl>
                  {kpi.items.map((item) => (
                    <div key={item.label} className="vision-kpi-row">
                      <dt className="text-[14px] leading-[1.8] text-ink">{item.label}</dt>
                      <dd className="text-[14px] font-semibold leading-[1.8] text-body">目標: {item.target}</dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* 推進体制 */}
      <section className="border-t border-line bg-cream py-20 min-[720px]:py-[88px]">
        <Container>
          <SectionHead kicker="Structure" title="推進体制" className="mb-10" />
          <div className="vision-structure">
            {structure.map((s) => (
              <FadeIn key={s.title} className="vision-structure-item">
                <h3 className="palt text-[22px] font-bold leading-[1.6] text-ink">{s.title}</h3>
                <p className="mt-5 text-[15px] leading-[2.1] text-body">{s.body}</p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

    </>
  );
}
