import { AboutSection } from "@/components/home/AboutSection";
import { BusinessSection } from "@/components/home/BusinessSection";
import { Hero } from "@/components/home/Hero";
import { HeroEntrance } from "@/components/home/HeroEntrance";
import { NewsSection } from "@/components/home/NewsSection";
import { PartnerSection } from "@/components/home/PartnerSection";
import { PurposeBand } from "@/components/home/PurposeBand";
import { ServiceSection } from "@/components/home/ServiceSection";
import { TechCultureSection } from "@/components/home/TechCultureSection";

// microCMS のニュースを定期再取得（ISR）
export const revalidate = 60;

export default function HomePage() {
  // data-home-entrance：ヒーローの文字を1文字ずつ打つ登場演出（HeroEntrance）の対象。
  // JavaScript が動かない環境では、noscript で文字と操作部をすぐ表示する。
  return (
    <div data-home-entrance data-top-initial="pending">
      {/* 並びは「どんな会社か → 何を頼めるか → 最近の動き → 人・採用」。
          お知らせは会社と事業の説明の後に置く（初めて来た人に、社内行事の記事を先に見せない。2026-11-27） */}
      <Hero />
      <AboutSection />
      <BusinessSection />
      <ServiceSection />
      <PurposeBand />
      <NewsSection />
      <TechCultureSection />
      <PartnerSection />
      <noscript><style>{`[data-home-entrance] .hero-rise{opacity:1!important}[data-home-entrance] [aria-label="トップ画像の切り替え"]{visibility:visible!important}`}</style></noscript>
      <HeroEntrance />
    </div>
  );
}
