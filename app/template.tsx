import type { ReactNode } from "react";
import { PageCurtain } from "@/components/layout/PageCurtain";

/**
 * ページ遷移のたびにマウントし直される枠。遷移の幕（PageCurtain）を差し込む。
 * ラッパー要素を足すと #main 直下を前提にした背景の図形・scroll-margin が崩れるため、Fragment で並べる。
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <PageCurtain />
    </>
  );
}
