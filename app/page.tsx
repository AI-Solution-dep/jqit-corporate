import { AboutSection } from "@/components/home/AboutSection";
import { BusinessSection } from "@/components/home/BusinessSection";
import { Hero } from "@/components/home/Hero";
import { NewsSection } from "@/components/home/NewsSection";
import { PartnerSection } from "@/components/home/PartnerSection";
import { PurposeBand } from "@/components/home/PurposeBand";
import { ServiceSection } from "@/components/home/ServiceSection";
import { TechCultureSection } from "@/components/home/TechCultureSection";

// microCMS のニュースを定期再取得（ISR）
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewsSection />
      <AboutSection />
      <BusinessSection />
      <ServiceSection />
      <PurposeBand />
      <TechCultureSection />
      <PartnerSection />
    </>
  );
}
