"use client";

/**
 * 画面に入ったら 0 から目標の数まで数え上げる数字（会社情報の「数字で見る JQIT」）。
 * サーバーでは最初から目標の数を出しておき（検索・読み上げ・JS 無しでも正しい）、画面に入る前に 0 へ戻してから数える。
 * 動きを減らす設定では数えない。
 */
import { useEffect, useRef, useState } from "react";

export function CountUp({ to, duration = 1400 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // すでに画面に見えている場合は数え直さない（読み込み直後にちらつかせない）
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setValue(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - k, 3);
          setValue(Math.round(to * eased));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
