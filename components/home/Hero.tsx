import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[1160px] px-6">
        <div className="flex min-h-0 flex-col justify-center pb-10 pt-14 min-[1280px]:min-h-[660px] min-[1280px]:py-20">
          <div className="pointer-events-auto max-w-[640px]">
            <div className="hero-rise">
              <Kicker className="mb-7">JQIT Corporate Site</Kicker>
            </div>
            <h1 className="palt text-[44px] font-bold leading-[1.16] tracking-[-0.03em] text-ink min-[720px]:text-[60px] min-[1200px]:text-[72px]">
              <span className="hero-rise inline-block [animation-delay:80ms]">
                挑戦と革新で、
              </span>
              <br />
              <span className="hero-rise inline-block [animation-delay:180ms]">
                顧客の<span className="text-brand">未来</span>を
              </span>
              <span className="hero-rise inline-block [animation-delay:180ms]">
                切り拓く。
              </span>
            </h1>
            <p className="hero-rise mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted [animation-delay:320ms]">
              Challenge &amp; Innovation — Since 2024
            </p>
            <p className="hero-rise mt-7 max-w-[470px] text-[16px] leading-[2.05] text-body [animation-delay:400ms]">
              私たちは、技術の力でお客様の“本質的な課題”を解決するITのプロフェッショナル集団です。ITとAI、ふたつのソリューションで企業の挑戦を支えます。
            </p>
            <div className="hero-rise mt-10 [animation-delay:500ms]">
              <Button href="/#business">事業を見る</Button>
            </div>
          </div>
        </div>
      </div>

      <HeroCarousel />
    </section>
  );
}
