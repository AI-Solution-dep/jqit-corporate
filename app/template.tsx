import type { ReactNode } from "react";
import { PageCurtain } from "@/components/layout/PageCurtain";
import { SiteClosingCta } from "@/components/layout/SiteClosingCta";

/**
 * ページ遷移のたびにマウントし直される枠。
 * ラッパー要素を足すと #main 直下を前提にした PageMotion・scroll-margin が崩れるため、Fragment で並べる。
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SiteClosingCta />
      <PageCurtain />
    </>
  );
}
