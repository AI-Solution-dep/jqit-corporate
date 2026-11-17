import { PageHeader } from "@/components/layout/PageHeader";
import { companySubNav, SubNav } from "@/components/layout/SubNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHead } from "@/components/ui/SectionHead";
import { Phrase, plainPhrase } from "@/components/ui/Phrase";
import { ValueOrbit } from "@/components/vision/ValueOrbit";
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
    title: "成長機会の|最大化と|社会への貢献",
  },
  {
    en: "Mission",
    title: "課題の“本質”を|捉える伴走者",
  },
  {
    en: "Vision",
    title: "“プロ”としての|自律性と|オーナーシップ",
  },
];

const values = [
  {
    title: "顧客中心",
    en: "Customer First",
    body: "常に顧客視点に立ち、お客様にとって真に価値のあるサービスを創造し提供する。",
  },
  {
    title: "デジタル化|社会への|貢献",
    en: "Digital Society",
    body: "デジタル化を推進し、新たな価値創造を通じて社会の持続的発展に貢献する。",
  },
  {
    title: "技術探求と|挑戦",
    en: "Exploration",
    body: "常に最新の技術を探求し、従来の枠を超えた革新的なソリューションに挑戦し続ける。",
  },
  {
    title: "学びと|自己実現",
    en: "Self-Growth",
    body: "社員一人ひとりが学び続ける姿勢を持ち、常に最善を尽くすことで、自己成長と自己実現をはかる。",
  },
  {
    title: "利他の|精神",
    en: "Altruism",
    body: "自己利益よりも他者の利益を優先し、共に成長する共生の文化を育む。",
  },
  {
    title: "人的資本を|育てる|文化",
    en: "Human Capital",
    body: "従業員が安心して働き、成長できる環境を整え、従業員の意見を積極的に聞き取り、反映させることで、企業と従業員双方にとってより良い状態を目指す。",
  },
];

const dxKpis = [
  {
    label: "Productivity",
    title: "社内業務の生産性向上",
    items: [
      { label: "事務工数|削減率", target: "2025年度までに 40％削減", figure: "40", unit: "%削減", when: "2025年度まで" },
      { label: "クラウド基盤|移行率", target: "2025年度末までに主要業務 100％移行", figure: "100", unit: "%", when: "2025年度末・主要業務" },
      { label: "AIマッチング|システム|導入率", target: "2025年度末までに 70％以上", figure: "70", unit: "%以上", when: "2025年度末まで" },
    ],
  },
  {
    label: "Data & Management",
    title: "経営革新・データ活用",
    items: [
      { label: "データ基盤|稼働率", target: "2025年度中に 100％", figure: "100", unit: "%", when: "2025年度中" },
      { label: "AI分析モデル|稼働数", target: "2025年度末までに 2モデル以上", figure: "2", unit: "モデル以上", when: "2025年度末まで" },
      { label: "経営判断支援|ダッシュボード|活用回数", target: "月次提出 100％", figure: "100", unit: "%", when: "月次提出" },
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
      <section className="bg-paper py-20 min-[720px]:py-[92px]">
        <Container>
          {/* 左に理念の一文、右に Purpose・Mission・Vision の3つの円を1つの円の線でつないだ図 */}
          <div className="philo-layout">
            <div>
              <SectionHead kicker="Philosophy" title="企業理念" className="mb-10" />
              <FadeIn>
                <p className="vision-statement palt text-[26px] font-bold leading-[1.6] tracking-[-0.02em] text-ink min-[720px]:text-[34px]">
                  『挑戦と革新で、顧客の<span className="text-brand">未来</span>
                  を切り拓く。』
                </p>
                <p className="mt-6 text-[15px] leading-[2.1] text-body">
                  私たちは、デジタル技術の力で顧客と社会に新たな価値を創造し、持続可能な未来の実現に貢献します。
                </p>
              </FadeIn>
            </div>
            <div className="philo-orbit">
              <svg className="philo-orbit-ring" viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="54" r="34" pathLength={1} />
              </svg>
              <p className="philo-orbit-core palt" aria-hidden>
                挑戦と
                <br />
                革新
              </p>
              <dl>
                {philosophy.map((p) => (
                  <div key={p.en} className="philo-node">
                    <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-(--warm-strong) min-[720px]:text-[11px]">
                      {p.en}
                    </dt>
                    <dd>
                      <h3 className="palt mt-1.5 text-[12px] font-bold leading-[1.55] text-ink min-[720px]:text-[15px]">
                        <Phrase text={p.title} />
                      </h3>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* 6つの行動指針 */}
      <section className="border-t border-line bg-cream py-20 min-[720px]:py-[88px]">
        <Container>
          <SectionHead
            kicker="Value"
            title={
              <>
                6つの<span className="text-brand">行動指針</span>
              </>
            }
            lead="当社は以下の6つの行動指針を軸に、事業活動を推進してまいります。円を押すと、それぞれの指針を読めます。"
            className="mb-10"
          />
          {/* 6つの円を1つの円の線でつなぎ、選んだ指針まで線が赤く伸びる（components/vision/ValueOrbit.tsx） */}
          <ValueOrbit values={values} />
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
          <FadeIn className="max-w-[860px] border-l-2 border-warm pl-6 min-[720px]:pl-8">
            <h3 className="palt text-[19px] font-bold leading-[1.6] text-ink">
              データ活用による経営革新
            </h3>
            <p className="mt-3 text-[14.5px] leading-[2.05] text-body">
              2025年度中に業務基幹システムを刷新し、AI機能を搭載したデータ基盤を構築。営業データと経営データの精度向上と連携強化により、迅速かつ的確な経営判断を可能にします。
            </p>
          </FadeIn>
          {/* 指標ごとに、目標値を大きく入れた3つの円を線でつなぐ。円の下に何の指標かを置く */}
          <div className="mt-14 space-y-16">
            {dxKpis.map((kpi) => (
              <FadeIn key={kpi.title} className="kpi-group">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-warm-ink">
                    {kpi.label}
                  </p>
                  <h3 className="palt mt-2 text-[20px] font-bold leading-[1.6] text-ink">
                    {kpi.title}
                  </h3>
                </div>
                {/* 各項目は dt（指標名）を先に書き、表示は CSS で円の下に回す */}
                <dl className="kpi-chain">
                  {kpi.items.map((item) => (
                    <div key={plainPhrase(item.label)} className="kpi-item">
                      <dt className="palt mt-4 text-center text-[12.5px] font-semibold leading-[1.6] text-ink min-[720px]:text-[13.5px]">
                        <Phrase text={item.label} />
                      </dt>
                      <dd className="kpi-circle">
                        <span className="sr-only">目標: {item.target}</span>
                        <span aria-hidden className="kpi-figure">
                          {item.figure}
                          <small>{item.unit}</small>
                        </span>
                        <span aria-hidden className="kpi-when">
                          {item.when}
                        </span>
                      </dd>
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
          {/* 箱にせず、文章のまとまりとして段をずらして並べる */}
          <div className="vision-structure">
            {structure.map((s) => (
              <FadeIn key={s.title} className="vision-structure-item">
                <h3 className="palt text-[21px] font-bold leading-[1.6] text-ink">{s.title}</h3>
                <p className="mt-4 text-[15px] leading-[2.1] text-body">{s.body}</p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

    </>
  );
}
