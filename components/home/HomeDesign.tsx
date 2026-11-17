import "./home-design.css";
import { AboutSection } from "@/components/home/AboutSection";
import { BusinessSection } from "@/components/home/BusinessSection";
import { Hero } from "@/components/home/Hero";
import { SectionHandoff } from "@/components/ui/SectionHandoff";
import { NewsSection } from "@/components/home/NewsSection";
import { PartnerSection } from "@/components/home/PartnerSection";
import { PurposeBand } from "@/components/home/PurposeBand";
import { ServiceSection } from "@/components/home/ServiceSection";
import { TechCultureSection } from "@/components/home/TechCultureSection";

const homeChapters = [
  { id: "news", label: "お知らせ" },
  { id: "about", label: "JQITについて" },
  { id: "business", label: "事業紹介" },
  { id: "service", label: "サービス" },
  { id: "tech-culture", label: "技術とカルチャー" },
  { id: "partner", label: "パートナー" },
] as const;

export function HomeDesign() {
  return (
    <>
      <Hero />
      <SectionHandoff chapters={homeChapters} rootSelector="[data-home-entrance]" />
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
