import { SectionWave } from "@/components/ui/SectionWave";
import "./home-design.css";
import { AboutSection } from "@/components/home/AboutSection";
import { BusinessSection } from "@/components/home/BusinessSection";
import { Hero } from "@/components/home/Hero";
import { NewsSection } from "@/components/home/NewsSection";
import { PartnerSection } from "@/components/home/PartnerSection";
import { PurposeBand } from "@/components/home/PurposeBand";
import { ServiceSection } from "@/components/home/ServiceSection";
import { TechCultureSection } from "@/components/home/TechCultureSection";

export function HomeDesign() {
  return (
    <>
      <Hero />
      <SectionWave from="paper" to="blush" />
      <NewsSection />
      <AboutSection />
      <BusinessSection />
      <ServiceSection />
      <PurposeBand />
      <TechCultureSection />
      <SectionWave from="warm" to="blush" reverse />
      <PartnerSection />
    </>
  );
}
