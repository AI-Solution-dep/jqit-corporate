"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { backdropFor, backdropTones, type BackdropKind } from "@/lib/page-backdrops";

/** 図形は SVG で描く（三角も枠線だけで描けるように）。
 *  枠線は太め（画面幅に応じて 6〜12px）。細い線だと「線の模様」に見えるため。
 *  太さは style で直接渡す（globals.css に書いた stroke-width の clamp() はビルドで落ちたため）。 */
function ShapePath({ kind, color, outline }: { kind: BackdropKind; color: string; outline?: boolean }) {
  const paint = outline
    ? { fill: "none", stroke: color, vectorEffect: "non-scaling-stroke" as const, style: { strokeWidth: "clamp(6px, 0.75vw, 12px)" } }
    : { fill: color };
  if (kind === "circle") return <circle cx="50" cy="50" r="49" {...paint} />;
  if (kind === "square") return <rect x="1" y="1" width="98" height="98" {...paint} />;
  return <polygon points="50,7 99,92 1,92" {...paint} />;
}

/**
 * 子ページの背景の図形。#main の背面に置き、最初から最後まで画面についてくる。
 * - #main 全体を覆う「線路」（.page-backdrop）の中の、高さ0の sticky 層（.page-backdrop-stage）に図形を置く。
 *   sticky 層に高さを持たせると、ページより背が高い場合に効かないため 0 にする。
 * - body の overflow-x は hidden だと sticky が効かないので、globals.css で clip にしている。
 * - 塗りの図形と、枠線だけの図形を混ぜる。図形ごとに上下か左右へ動く。transform だけを動かし、reduced-motion では止める。
 */
export function PageBackdrop() {
  const pathname = usePathname() ?? "/";
  const shapes = backdropFor(pathname);

  // セクションの背景色を透かす等の切り替えは、#main の属性で CSS 側に任せる。
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    if (shapes) main.dataset.backdrop = "";
    else delete main.dataset.backdrop;
    return () => { delete main.dataset.backdrop; };
  }, [shapes]);

  if (!shapes) return null;
  return (
    <div className="page-backdrop" aria-hidden="true">
      <div className="page-backdrop-stage">
        {shapes.map((s, i) => (
          <span
            key={`${pathname}-${i}`}
            className={`page-backdrop-mover page-backdrop-move-${s.axis}`}
            style={{
              left: `${s.left}vw`,
              top: `${s.top}vh`,
              width: `max(${s.size}vw, ${Math.round(s.size * 6.4)}px)`,
              animationDuration: `${s.dur}s`,
              animationDirection: s.reverse ? "alternate-reverse" : "alternate",
            }}
          >
            <svg className="page-backdrop-shape" viewBox="0 0 100 100" style={{ rotate: `${s.rotate ?? 0}deg` }}>
              <ShapePath kind={s.kind} color={`rgb(${backdropTones[s.tone]} / ${s.alpha})`} outline={s.outline} />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
