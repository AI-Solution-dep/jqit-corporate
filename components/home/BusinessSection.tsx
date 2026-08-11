import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DisplayText } from "@/components/ui/DisplayText";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";

const businesses = [
  {
    no: "01",
    en: "IT Solutions",
    title: "ITソリューション事業",
    body: "システム構築の要件定義から運用保守まで。受託開発（SI）とSESにより、Web・業務システム開発、インフラ構築、QA・第三者検証をワンストップで提供します。",
    tags: ["開発", "インフラ", "QA"],
    image: "/natural-tech-it.webp",
    alt: "自然光の入るオフィスでシステム設計を議論するエンジニア",
    href: "/business/it-solutions",
  },
  {
    no: "02",
    en: "AI Solutions",
    title: "AIソリューション事業",
    body: "生成AIの導入支援・コンサルティングからAIシステム開発まで。大規模言語モデルを中心に、企業のAI活用を全面的にサポートします。",
    tags: ["生成AI導入支援", "RAG・チャットボット", "AIエージェント開発", "AI人材育成"],
    image: "/natural-tech-ai.webp",
    alt: "AIデータ可視化を前に分析するメンバー",
    href: "/business/ai-solutions",
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

        <div className="space-y-16 min-[900px]:space-y-24">
          {businesses.map((b, i) => (
            <FadeIn
              key={b.no}
              className="grid grid-cols-1 items-center gap-8 min-[900px]:grid-cols-[1.05fr_0.95fr] min-[900px]:gap-16"
            >
              {/* 写真（偶数行は右へ） */}
              <div className={`relative ${i % 2 === 1 ? "min-[900px]:order-2" : ""}`}>
                <Image
                  src={b.image}
                  alt={b.alt}
                  width={1448}
                  height={1086}
                  sizes="(min-width: 900px) 50vw, 100vw"
                  className="h-auto w-full rounded-xl object-cover"
                />
                <span
                  aria-hidden
                  className={`absolute -bottom-4 font-anton text-[64px] leading-none text-brand [text-shadow:0_0_2px_rgba(255,255,255,0.9),0_0_18px_rgba(255,255,255,0.95)] min-[720px]:-bottom-5 min-[720px]:text-[84px] ${
                    i % 2 === 1 ? "right-6" : "left-6"
                  }`}
                >
                  {b.no}
                </span>
              </div>

              {/* テキスト */}
              <div className={i % 2 === 1 ? "min-[900px]:order-1" : ""}>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                  {b.en}
                </p>
                <h3 className="palt text-[24px] font-bold tracking-[-0.02em] text-ink min-[720px]:text-[30px]">
                  {b.title}
                </h3>
                <p className="mt-5 max-w-[440px] text-[15px] leading-[2.05] text-body">
                  {b.body}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {b.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-card border border-line px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-body"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href={b.href}
                  className="group mt-7 inline-flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.12em] text-ink transition-colors hover:text-brand"
                >
                  {b.title}を詳しく見る
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
