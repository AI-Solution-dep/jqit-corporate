"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";

export type TypeSegment = { text: string; className?: string };

/**
 * 文字が1文字ずつ打たれるように現れる文章。画面に入ったときに1度だけ再生する。
 * - 文字の並びはサーバーで描いておく（検索エンジンは全文を読める）。読み上げは sr-only の全文を使い、1文字ずつの span は隠す。
 * - JS が動かないときは CSS の安全弁（globals.css の type-fallback）で約2.5秒後に全文を出す。
 * - 動きを減らす設定では最初から全文を出す。
 */
export function TypeText({
  as: Tag = "p",
  segments,
  className = "",
  interval = 40,
  delay = 0,
}: {
  as?: ElementType;
  segments: readonly TypeSegment[];
  className?: string;
  /** 1文字あたりの間隔（ミリ秒） */
  interval?: number;
  /** 画面に入ってから打ち始めるまでの待ち（ミリ秒） */
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"waiting" | "play" | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setState("play");
      return;
    }
    setState("waiting");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("play");
        io.disconnect();
      },
      // 画面の下の端で始まると見逃すので、下から2割より上に来てから打ち始める
      { threshold: 0.4, rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let index = 0;
  const fullText = segments.map((s) => s.text).join("");

  return (
    <Tag ref={ref} className={`type-text ${className}`} data-type={state}>
      <span className="sr-only">{fullText}</span>
      <span aria-hidden>
        {segments.map((segment, si) => (
          <span key={si} className={segment.className}>
            {Array.from(segment.text).map((char) => {
              const d = delay + index++ * interval;
              return (
                <span key={index} className="type-char" style={{ "--type-d": `${d}ms` } as CSSProperties}>
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </Tag>
  );
}
