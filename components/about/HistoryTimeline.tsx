"use client";

/**
 * 会社情報の沿革（2026-11-19）。
 * - 載せるのはニュースで公表した出来事と会社概要の事実だけ（推測で足さない）。月が分からないものは月を出さない。
 * - 左に年、右にその年の出来事を縦に並べる（年ごとの数の差で、横の列だと高さが揃わないため。2026-11-19）。
 * - 画面の上から 7 割の線を基準に、左の線が上から下へオレンジに伸び、
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
  const [reachedCount, setReachedCount] = useState(0); // 線が届いた年の数

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      setReachedCount(years.length);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const line = window.innerHeight * 0.7;
      // 線は「画面の 7 割の線」まで伸びる。年は、その上端が線を越えたら点灯する
      setProgress(Math.max(0, Math.min(1, (line - r.top) / r.height)));
      const tops = [...el.querySelectorAll<HTMLElement>(":scope > .history-year")].map((li) => li.getBoundingClientRect().top);
      setReachedCount(tops.filter((t) => t <= line).length);
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
  }, [years.length]);

  return (
    <ol ref={ref} className="history" style={{ "--history-p": progress.toFixed(3) } as React.CSSProperties}>
      <span className="history-rail" aria-hidden />
      {years.map((y, i) => {
        const reached = i < reachedCount;
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
