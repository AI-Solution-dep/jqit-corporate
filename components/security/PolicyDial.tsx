"use client";

/**
 * 情報セキュリティ基本方針の目次（PC のみ。2026-11-18 オーナーと決めた形）。
 * 左に中心を置いた大きな円の縁に、節の番号の丸を並べる。いま読んでいる節の丸が一番右に来てオレンジになり、
 * 横に節の名前を1行だけまっすぐ出す。下へ読み進めると、次の丸が下から左回りに上がってきて、読み終えた丸は上へ回って左に消える
 * （読む向きと同じく、下にこれからの節、上に読み終えた節が来る。2026-11-19 オーナー判断で逆回りに）。
 * - 文字を円に沿って回すと読みにくいため、回すのは番号の丸だけにする。
 * - 遠い丸は透かさず紙の色を重ねて薄くする（透かすと後ろの線が丸の中に見える）。
 * - 動きを減らす設定では、回る動きと輪の広がりを付けない（CSS 側）。
 */
import { useEffect, useState } from "react";

export type PolicyDialItem = {
  id: string;
  /** 丸の中に出す番号。無い節は icon で示す */
  no?: number;
  icon?: "shield" | "mail";
  title: string;
};

const R = 250; // 円の半径
const STEP = (17 * Math.PI) / 180; // 丸どうしの角度の間隔
const SHOW = 3; // いまの丸から、上下いくつ先まで見せるか（この数で消える）
const CX = 70; // いまの丸の中心（左端からの距離）
const H = 400; // 目次の高さ
const ARC = (52 * Math.PI) / 180; // 線を描く範囲（上下それぞれ）

function arcPath(a0: number, a1: number) {
  const cx = CX - R;
  const cy = H / 2;
  const p = (a: number) => `${cx + R * Math.cos(a)} ${cy + R * Math.sin(a)}`;
  return `M${p(a0)} A${R} ${R} 0 0 1 ${p(a1)}`;
}

function Icon({ name }: { name: "shield" | "mail" }) {
  return name === "shield" ? (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M8 1.5 2.5 3.8v4c0 3.2 2.3 5.6 5.5 6.7 3.2-1.1 5.5-3.5 5.5-6.7v-4z" />
      <path d="m5.5 8 1.8 1.8L10.8 6.3" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="m2.5 4.5 5.5 4.2 5.5-4.2" />
    </svg>
  );
}

export function PolicyDial({ items }: { items: PolicyDialItem[] }) {
  const [current, setCurrent] = useState(0);

  // いま読んでいる節：画面の上から 3 割の線を越えた最後の節
  useEffect(() => {
    let raf = 0;
    const spy = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let idx = 0;
      items.forEach((it, i) => {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      setCurrent(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(spy);
    };
    spy();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  return (
    <nav aria-label="目次" className="policy-toc">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-warm-ink">Contents</p>
      <div className="dial-stage" style={{ height: H }}>
        {/* 線：上（読み終えた側）はオレンジ、真ん中から下（これから読む側）は細い灰色。上下の端は消える */}
        <svg className="dial-rim" width={CX + 40} height={H} aria-hidden>
          <defs>
            <linearGradient id="dial-read" x1="0" y1="0" x2="0" y2="1">
              <stop offset=".1" stopColor="#f08c3a" stopOpacity="0" />
              <stop offset="1" stopColor="#f08c3a" />
            </linearGradient>
            <linearGradient id="dial-next" x1="0" y1="0" x2="0" y2="1">
              <stop offset=".45" stopColor="#d8d3c8" />
              <stop offset="1" stopColor="#d8d3c8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={arcPath(-ARC, 0)} fill="none" stroke="url(#dial-read)" strokeWidth="2" strokeLinecap="round" />
          <path d={arcPath(0, ARC)} fill="none" stroke="url(#dial-next)" strokeWidth="1.25" />
        </svg>

        {items.map((it, i) => {
          const d = i - current; // d > 0：次の節（下）、d < 0：読み終えた節（上）
          const ang = d * STEP; // 下向きを正にとる。読み進めると丸は上へ（左回りに）動く
          const x = CX + (Math.cos(ang) - 1) * R;
          const y = Math.sin(ang) * R;
          const far = Math.abs(d);
          const scale = d === 0 ? 1.25 : 1 - Math.min(far, 3) * 0.08;
          const hidden = far >= SHOW;
          const label = `${it.no ? `${it.no}. ` : ""}${it.title}`;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`dial-dot ${d === 0 ? "is-current" : d < 0 ? "is-done" : ""}`}
              aria-label={label}
              aria-current={d === 0 ? "location" : undefined}
              tabIndex={hidden ? -1 : undefined}
              style={
                {
                  // 小数はサーバーとブラウザで丸め方が違い、表示の食い違い（hydration）の警告になるので 2 桁に丸める
                  transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(2)})`,
                  opacity: hidden ? 0 : 1,
                  pointerEvents: hidden ? "none" : "auto",
                  "--veil": Math.min(far * 0.3, 0.9).toFixed(2),
                } as React.CSSProperties
              }
            >
              {it.icon ? <Icon name={it.icon} /> : it.no}
              {/* 切り替わったとき一度だけ広がる輪。key を変えて毎回やり直す */}
              {d === 0 && <span key={`ping-${current}`} className="dial-ping" aria-hidden />}
            </a>
          );
        })}

        {/* 節の名前。丸と同じ距離・同じ速さで動く。後ろの節の名前は下で待ち、読み終えた名前は上へ抜ける */}
        <div
          className="dial-title"
          // 名前を丸と一緒に動かす：丸が1つ分動く高さ（R・sin(STEP)）だけ上下に移す
          style={{ left: CX + 38, "--dial-shift": `${(R * Math.sin(STEP)).toFixed(1)}px` } as React.CSSProperties}
          aria-hidden
        >
          {items.map((it, i) => (
            <span key={it.id} className={i === current ? "is-in" : i > current ? "is-from" : "is-out"}>
              {it.title}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}
