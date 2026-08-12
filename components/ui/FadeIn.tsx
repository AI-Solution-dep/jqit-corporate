"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * スクロールで現れるリビール。すでに画面内にある要素は最初から表示する
 * （デザイン原本 JQIT.dc.html のロジックを移植）。
 */
export function FadeIn({
  className = "",
  id,
  children,
}: {
  className?: string;
  /** ページ内アンカー（#ses など）の着地点にする場合に指定 */
  id?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }
    // すでに画面内なら表示のまま
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setHidden(true);

    let settled = false;
    // 表示は1度だけ。IntersectionObserver と安全弁のどちらが先でも同じ結果にする
    const reveal = () => {
      if (settled) return;
      settled = true;
      setHidden(false);
      io.disconnect();
      window.clearInterval(timer);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    // 安全弁: IntersectionObserver が働かない場合でもコンテンツを隠したままにしない。
    // ただし対象は「画面内にあるのに表示されていない要素」だけ。
    // 以前は位置に関係なく一定時間後に全要素を表示していたため、
    // 2.6秒以内にスクロールが届かなかった要素はフェードせずに現れていた。
    const timer = window.setInterval(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) reveal();
    }, 2600);

    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div ref={ref} id={id} data-hidden={hidden} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
