import { HeroEntrance } from "@/components/home/HeroEntrance";
import { HomeDesign } from "@/components/home/HomeDesign";
import { HomeScrollDepth } from "@/components/home/HomeScrollDepth";

// microCMS のニュースを定期再取得（ISR）
export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="home-design" data-home-entrance data-scroll-depth="pending" data-top-initial="pending">
      <HomeDesign />
      <noscript><style>{`[data-home-entrance] .hero-rise{opacity:1!important}[data-home-entrance] [aria-label="トップ画像の切り替え"]{visibility:visible!important}body:has([data-home-entrance])>header{visibility:visible!important}`}</style></noscript>
      <HomeScrollDepth enabled />
      <HeroEntrance />
    </div>
  );
}
