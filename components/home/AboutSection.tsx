import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DisplayText } from "@/components/ui/DisplayText";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHead } from "@/components/ui/SectionHead";

const trustSignals = [
  {
    name: "106名の組織体制",
    description: "IT・AIの両事業を支える組織",
    meta: "2026年4月時点",
  },
  {
    name: "ISO/IEC 27001（ISMS）",
    description: "情報セキュリティ管理体制を構築・運用",
    image: { src: "/badges/isms-iso27001.png", width: 200, height: 78 },
  },
  {
    name: "DX認定事業者",
    description: "経営とデジタル変革を一体で推進",
    image: { src: "/badges/dx-nintei.png", width: 1736, height: 492 },
  },
  {
    name: "ISTQB® Gold パートナー",
    description: "ソフトウェア品質・テスト分野の専門性",
    image: { src: "/badges/istqb-gold.png", width: 2063, height: 738 },
  },
] as const;

export function AboutSection() {
  return (
    <section id="about" className="overflow-hidden border-t border-line bg-cream py-20 min-[720px]:py-24">
      <Container>
        <FadeIn>
          <DisplayText className="-ml-1 mb-8">ABOUT US</DisplayText>
        </FadeIn>
        <div className="grid grid-cols-1 items-start gap-12 min-[1024px]:grid-cols-2 min-[1024px]:gap-16">
          <div>
            <SectionHead
              kicker="About"
              title={
                <>
                  課題の“本質”を捉える、
                  <br />
                  <span className="text-brand">伴走者</span>であり続ける。
                </>
              }
              lead="株式会社JQITは、システム開発・インフラ・QAを担うITソリューション事業と、生成AI・AIエージェント開発を担うAIソリューション事業の両輪で、お客様のビジネスを技術で支えるITカンパニーです。"
            />
            <FadeIn className="mt-8">
              <Button href="/about" variant="arrow">
                JQITについて知る
              </Button>
            </FadeIn>
          </div>
          <FadeIn className="grid grid-cols-2 gap-px border border-line bg-line">
            {trustSignals.map((signal) => (
              <article
                key={signal.name}
                className="flex min-h-[190px] flex-col bg-white px-5 py-6 min-[720px]:min-h-[220px] min-[720px]:px-7 min-[720px]:py-8"
              >
                {"image" in signal ? (
                  <div className="flex h-11 items-center">
                    <Image
                      src={signal.image.src}
                      alt={signal.name}
                      width={signal.image.width}
                      height={signal.image.height}
                      className="max-h-10 w-auto max-w-full object-contain object-left"
                    />
                  </div>
                ) : (
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-warm-ink">
                    Organization
                  </p>
                )}
                <div className="mt-auto pt-6">
                  <h3 className="palt text-[16px] font-bold leading-[1.55] text-ink min-[720px]:text-[18px]">
                    {signal.name}
                  </h3>
                  <p className="mt-2 text-[12px] leading-[1.8] text-body min-[720px]:text-[13px]">
                    {signal.description}
                  </p>
                  {"meta" in signal && (
                    <p className="mt-2 font-mono text-[9.5px] tracking-[0.1em] text-muted">
                      {signal.meta}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
