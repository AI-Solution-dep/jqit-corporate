import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DisplayText } from "@/components/ui/DisplayText";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";

const businesses = [
  {
    en: "IT Solutions",
    title: "ITソリューション事業",
    body: "システム構築の要件定義から運用保守まで。受託開発（SI）とSESにより、Web・業務システム開発、インフラ構築、QA・第三者検証をワンストップで提供します。",
    tags: ["開発", "インフラ", "QA"],
    image: "/natural-tech-it.webp",
    alt: "自然光の入るオフィスでシステム設計を議論するエンジニア",
    href: "/business/it-solutions",
    /** カテゴリ単位のセクションへの導線。トップから直接その章に着地できるようにする */
    subLinks: [
      { label: "SES（システムエンジニアリングサービス）", href: "/business/it-solutions#ses" },
      { label: "受託開発（SI）", href: "/business/it-solutions#contract-development" },
    ],
  },
  {
    en: "AI Solutions",
    title: "AIソリューション事業",
    body: "生成AIの導入支援・コンサルティングからAIシステム開発まで。大規模言語モデルを中心に、企業のAI活用を全面的にサポートします。",
    tags: ["生成AI導入支援", "RAG・チャットボット", "AIエージェント開発", "AI人材育成"],
    image: "/natural-tech-ai.webp",
    alt: "AIデータ可視化を前に分析するメンバー",
    href: "/business/ai-solutions",
    subLinks: [
      { label: "AIエージェント開発・RAG構築", href: "/business/ai-solutions#ai-agent" },
      { label: "AI導入支援・内製化支援", href: "/business/ai-solutions#ai-consulting" },
    ],
  },
];

export function BusinessSection() {
  return (
    <section id="business" className="overflow-hidden bg-paper pb-20 pt-4 min-[720px]:pb-24">
      <Container>
        <FadeIn className="mb-12 min-[720px]:mb-16">
          <DisplayText className="-ml-1 mb-8">BUSINESS</DisplayText>
          <Kicker className="mb-4">Business</Kicker>
          <h2 className="palt max-w-[720px] text-[28px] font-bold leading-[1.4] tracking-[-0.02em] text-ink md:text-[38px]">
            ITとAI、<span className="text-brand">ふたつの力</span>で課題を解く。
          </h2>
        </FadeIn>

        {/* ITとAI「ふたつの力」を、写真いっぱいの左右2枚のパネルで見せ、真ん中を「×」の円でつなぐ。
            PC ではマウスを乗せた側が広がる。パネル全体が事業ページへのリンク（中の小さなリンクは前面に出す） */}
        <FadeIn className="biz-split">
          {businesses.map((b, i) => (
            <div key={b.en} className={`biz-panel ${i === 0 ? "photo-curve--reverse" : "photo-curve"}`}>
              {/* 写真の上に文字を載せない（読みにくいため）。上が写真、下が墨色の無地の面 */}
              <div className="biz-panel-media">
                <Image
                  src={b.image}
                  alt={b.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="biz-panel-photo object-cover"
                />
              </div>
              <div className="biz-panel-body">
                <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
                  <span aria-hidden className="h-px w-5 bg-warm" />
                  {b.en}
                </p>
                <h3 className="palt mt-2 text-[26px] font-bold tracking-[-0.02em] text-white min-[720px]:text-[32px]">
                  {b.title}
                </h3>
                <p className="mt-4 max-w-[440px] text-[14px] leading-[2] text-white/85">{b.body}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {b.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-label border border-white/35 px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-white/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {b.subLinks && (
                  <ul className="biz-panel-sublinks mt-6 flex flex-wrap gap-x-6 gap-y-2">
                    {b.subLinks.map((s) => (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          className="inline-flex items-center gap-2 text-[13px] leading-[1.8] text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline"
                        >
                          <span aria-hidden className="h-px w-3 shrink-0 bg-warm" />
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {/* 行き先が分かる文言のリンク。パネル全体を押せるよう、このリンクの当たり判定をパネルいっぱいに広げる */}
                <Link href={b.href} className="biz-panel-more biz-panel-link">
                  {b.title}を詳しく見る <span aria-hidden className="biz-panel-arrow">→</span>
                </Link>
              </div>
            </div>
          ))}
          <span aria-hidden className="biz-cross">×</span>
        </FadeIn>
      </Container>
    </section>
  );
}
