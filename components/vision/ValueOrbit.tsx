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
 * 説明文は6つとも HTML に出しておく。見た目の切り替えは読み上げから隠し、
 * 読み上げ用には6つの全文を sr-only の一覧で別に置く（自動送りで読み上げが流れ続けないように aria-live は使わない）。
 * 自動送りは「止める」ボタンでも止められる（WCAG 2.2.2）。
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
          {/* 中心の円から6つの円へ伸びる線。選んでいる円への線だけ濃く描き直す */}
          {values.map((v, i) => {
            const a = (-90 + (360 / count) * i) * (Math.PI / 180);
            const from = 13;
            const to = 29;
            return (
              <line
                key={`${v.title}-spoke`}
                x1={50 + from * Math.cos(a)}
                y1={50 + from * Math.sin(a)}
                x2={50 + to * Math.cos(a)}
                y2={50 + to * Math.sin(a)}
                pathLength={1}
                className="value-orbit-spoke"
                data-active={i === active || undefined}
              />
            );
          })}
        </svg>
        <p className="value-orbit-core palt" aria-hidden>
          <span className="value-orbit-core-en">JQIT</span>
          行動指針
        </p>
        {values.map((v, i) => (
          <button
            key={v.title}
            type="button"
            className="value-orbit-node palt"
            data-state={i === active ? "active" : i < active ? "passed" : undefined}
            style={position(i)}
            aria-pressed={i === active}
            onClick={() => select(i)}
          >
            <Phrase text={v.title} />
          </button>
        ))}
      </div>

      {/* 読み上げ用の全文（見た目の切り替えとは別に、6つを順に読めるように） */}
      <dl className="sr-only">
        {values.map((v) => (
          <div key={`${v.title}-sr`}>
            <dt>{v.title.replaceAll("|", "")}</dt>
            <dd>{v.body}</dd>
          </div>
        ))}
      </dl>

      <div className="value-orbit-detail">
        {values.map((v, i) => (
          <div
            key={v.title}
            id={`value-detail-${i}`}
            className="value-orbit-text"
            data-active={i === active || undefined}
            aria-hidden
          >
            <p className="value-orbit-en" aria-hidden>
              {v.en}
            </p>
            <h3 className="palt mt-2 text-[22px] font-bold leading-[1.55] text-ink min-[1024px]:text-[30px]">
              <Phrase text={v.title} />
            </h3>
            <span aria-hidden className="value-orbit-rule" />
            <p className="text-[14.5px] leading-[2.05] text-body min-[1024px]:text-[16px]">{v.body}</p>
          </div>
        ))}
        {/* 自動送りの残り時間（選択が変わるたびに伸び直す。止まっている間は出さない） */}
        <span
          key={`timer-${active}`}
          aria-hidden
          className="value-orbit-timer"
          data-running={(auto && inView && !paused) || undefined}
          data-off={!auto || undefined}
          style={{ gridArea: "2 / 1", animationDuration: `${AUTO_ADVANCE_MS}ms` }}
        />
        <div className="value-orbit-nav" style={{ gridArea: "3 / 1" }}>
          <button type="button" onClick={() => select((active - 1 + count) % count)}>
            <span aria-hidden>←</span> 前の指針
          </button>
          <button type="button" onClick={() => select((active + 1) % count)}>
            次の指針 <span aria-hidden>→</span>
          </button>
          {auto && (
            <button type="button" onClick={() => setAuto(false)}>
              自動送りを止める
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
