"use client";

/**
 * 会社情報の沿革（2026-11-19）。年ごとの列に、その年の出来事を並べる。
 * - 載せるのはニュースで公表した出来事と会社概要の事実だけ（推測で足さない）。月が分からないものは月を出さない。
 * - 画面に入ってからのスクロールに合わせて、年の上の線が左から右（スマホは上から下）へオレンジに伸び、
 *   線が届いた年の数字が濃くなって、その年の出来事が順に浮かび上がる。
 * - 動きを減らす設定では、線も出来事も最初から出す（CSS 側）。
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type HistoryEvent = { month?: number; text: string; href?: string };
export type HistoryYear = { year: number; events: HistoryEvent[] };

export function HistoryTimeline({ years }: { years: HistoryYear[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0); // 0〜1：線の伸び

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 一覧の上端が画面の 85% に来たら伸び始め、下端が画面の 60% に来たら伸び切る
      const start = vh * 0.85;
      const end = vh * 0.6;
      const p = (start - r.top) / (start - end + r.height);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const n = years.length;
  return (
    <ol ref={ref} className="history" style={{ "--history-p": progress.toFixed(3) } as React.CSSProperties}>
      <span className="history-rail" aria-hidden />
      {years.map((y, i) => {
        // 線がこの年の位置まで届いたら、この年を「点灯」させる
        const reached = progress >= (i + 0.15) / n;
        return (
          <li key={y.year} className="history-year" data-reached={reached || undefined}>
            <p className="history-num">
              {y.year}
              <span>年</span>
            </p>
            <ul>
              {y.events.map((e, j) => (
                <li key={e.text} style={{ transitionDelay: reached ? `${j * 90}ms` : "0ms" }}>
                  <span className="history-month">{e.month ? `${e.month}月` : ""}</span>
                  {e.href ? (
                    <Link href={e.href} className="history-link">
                      {e.text}
                    </Link>
                  ) : (
                    <span>{e.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
