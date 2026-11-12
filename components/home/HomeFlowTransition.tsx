"use client";

import { useEffect, useRef } from "react";
import { FlowAnimationControl } from "@/components/ui/FlowAnimationControl";
import "./home-flow-transition.css";

/** 写真とコピーには触れず、TOPの下でスクロールを次の内容へつなぐ。 */
export function HomeFlowTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const paint = () => {
      frame = 0;
      const top = element.getBoundingClientRect().top + window.scrollY;
      const start = Math.max(0, top - window.innerHeight * .95);
      const progress = reduce.matches ? 1 : Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(420, window.innerHeight * .7)));
      element.style.setProperty("--flow-draw", String(Math.max(0, 1 - progress * 1.5)));
      element.style.setProperty("--flow-x", `${reduce.matches ? 0 : (progress - 1) * 120}px`);
      element.style.setProperty("--flow-alpha", String(reduce.matches ? 1 : Math.min(1, progress * 6)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const observer = new ResizeObserver(schedule);
    if (element.parentElement) observer.observe(element.parentElement);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduce.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduce.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div ref={ref} className="home-flow-transition" aria-hidden="true">
      <FlowAnimationControl />
      <svg viewBox="0 0 1440 240" preserveAspectRatio="none" fill="none">
        <path pathLength="1" d="M-80 142C160-8 350 10 556 132S910 254 1110 116S1360 20 1520 86" />
        <path pathLength="1" d="M-80 160C160 10 350 28 556 150S910 272 1110 134S1360 38 1520 104" />
        <path pathLength="1" d="M-80 178C160 28 350 46 556 168S910 290 1110 152S1360 56 1520 122" />
      </svg>
    </div>
  );
}
