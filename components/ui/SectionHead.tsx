import type { ReactNode } from "react";
import { FadeIn } from "./FadeIn";
import { Kicker } from "./Kicker";

export function SectionHead({
  kicker,
  title,
  lead,
  center = false,
  className = "",
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <FadeIn className={`${center ? "mx-auto text-center" : ""} ${className}`}>
      <Kicker className="mb-4">{kicker}</Kicker>
      <h2 className="palt text-[28px] font-bold leading-[1.4] tracking-[-0.02em] text-ink md:text-[38px]">
        {title}
      </h2>
      {lead && (
        <p className="mt-6 text-[15px] leading-[2.1] text-body">{lead}</p>
      )}
    </FadeIn>
  );
}
