import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHead } from "@/components/ui/SectionHead";

const organization = {
  figure: "106",
  name: "106名の組織体制",
  description: "IT・AIの両事業を支える組織",
  meta: "2026年4月時点",
};

const certifications = [
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
          {/* タイルに入れず、組織の規模は大きな数字、認証はロゴを罫線で区切った並びで見せる */}
          <FadeIn className="trust-panel">
            <div className="trust-figure">
              <p className="trust-figure-number">
                {organization.figure}
                <small>名</small>
              </p>
              <div>
                <h3 className="palt text-[17px] font-bold leading-[1.55] text-ink min-[720px]:text-[19px]">
                  {organization.name}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.8] text-body">
                  {organization.description}
                  <span className="ml-2 font-mono text-[10.5px] tracking-[0.1em] text-muted">
                    {organization.meta}
                  </span>
                </p>
              </div>
            </div>
            <ul className="trust-badges">
              {certifications.map((c) => (
                <li key={c.name}>
                  <div className="flex h-11 items-center">
                    <Image
                      src={c.image.src}
                      alt={c.name}
                      width={c.image.width}
                      height={c.image.height}
                      className="max-h-10 w-auto max-w-full object-contain object-left"
                    />
                  </div>
                  <h3 className="palt mt-4 text-[14.5px] font-bold leading-[1.55] text-ink">{c.name}</h3>
                  <p className="mt-1 text-[12px] leading-[1.75] text-body">{c.description}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
