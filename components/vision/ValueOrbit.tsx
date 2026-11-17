"use client";

import { useEffect, useRef, useState } from "react";
import { Phrase } from "@/components/ui/Phrase";

type Value = { title: string; en: string; body: string };

/** 自動で次の指針へ進む間隔（ミリ秒）。読み終わる前に変わらないよう長めに取る */
const AUTO_ADVANCE_MS = 4800;

/**
 * 6つの行動指針を、1つの円の線の上に並んだ6つの円で見せる。
 * 選んだ円まで円の線が赤く伸び、中央（スマホは図の下）にその指針の説明が出る。
 * 画面に入ると順に自動で進み、利用者が円を押したら自動送りは止める。
 * 説明文は6つとも HTML に出しておく（検索エンジン・支援技術が全文を読めるように）。
 */
export function ValueOrbit({ values }: { values: readonly Value[] }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = values.length;

  // 画面に入っている間だけ自動で進める
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.45,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % count), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [active, auto, inView, paused, count]);

  const select = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  // 円の線の上の位置（真上から時計回り。中心50%・半径40%）
  const position = (i: number) => {
    const angle = (-90 + (360 / count) * i) * (Math.PI / 180);
    return { left: `${50 + 40 * Math.cos(angle)}%`, top: `${50 + 40 * Math.sin(angle)}%` };
  };

  return (
    <div
      ref={ref}
      className="value-orbit"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="value-orbit-figure">
        <svg className="value-orbit-ring" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="40" className="value-orbit-ring-base" />
          {/* 真上の円から、選んだ円まで赤く伸びる弧 */}
          <circle
            cx="50"
            cy="50"
            r="40"
            pathLength={count * 100}
            transform="rotate(-90 50 50)"
            className="value-orbit-ring-progress"
            style={{ strokeDasharray: `${active * 100} ${count * 100}` }}
          />
        </svg>
        <p className="value-orbit-core" aria-hidden>
          Value
        </p>
        {values.map((v, i) => (
          <button
            key={v.title}
            type="button"
            className="value-orbit-node palt"
            data-state={i === active ? "active" : i < active ? "passed" : undefined}
            style={position(i)}
            aria-pressed={i === active}
            aria-controls={`value-detail-${i}`}
            onClick={() => select(i)}
          >
            <Phrase text={v.title} />
          </button>
        ))}
      </div>

      <div className="value-orbit-detail" aria-live="polite">
        {values.map((v, i) => (
          <div
            key={v.title}
            id={`value-detail-${i}`}
            className="value-orbit-text"
            data-active={i === active || undefined}
            aria-hidden={i !== active}
          >
            <p className="value-orbit-en" aria-hidden>
              {v.en}
            </p>
            <h3 className="palt mt-2 text-[21px] font-bold leading-[1.55] text-ink min-[720px]:text-[24px]">
              <Phrase text={v.title} />
            </h3>
            <span aria-hidden className="value-orbit-rule" />
            <p className="text-[14px] leading-[2] text-body">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
