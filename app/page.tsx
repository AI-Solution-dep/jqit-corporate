import { HeroEntrance } from "@/components/home/HeroEntrance";
import { HomeContent } from "@/components/home/HomeContent";

// microCMS のニュースを定期再取得（ISR）
export const revalidate = 60;

export default function HomePage() {
  return (
    <div data-home-entrance data-top-initial="pending">
      <noscript><style>{`[data-home-entrance] .hero-rise{opacity:1!important}[data-home-entrance] [aria-label="トップ画像の切り替え"]{visibility:visible!important}body:has([data-home-entrance])>header{visibility:visible!important}`}</style></noscript>
      <HomeContent />
      <HeroEntrance />
    </div>
  );
}
