"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  particleAt,
  sampleLogoParticles,
  stepForLimit,
  type LogoParticle,
  type ParticleFrame,
} from "@/lib/logo-particles";

const LOGO = { src: "/jqit-logo.png", width: 425, height: 118 } as const;

/** 粒が集まるまでの時間と、本物の画像へ切り替える時間（ミリ秒） */
const GATHER_MS = 1800;
const SWAP_MS = 600;
/** 粒が散る範囲（ロゴの外側へ何 px まで描くか）。縦は、置かれた帯の余白に合わせて狭める */
const MARGIN_X = 170;
const MARGIN_Y = 80;
const MIN_MARGIN_Y = 24;
/** サイト内の遷移で出る幕（globals.css の page-curtain、約0.94秒）が抜けるのを待つ時間 */
const CURTAIN_WAIT_MS = 800;
const MAX_PARTICLES = 9000;
/** 赤（輪）と黒（文字）。public/jqit-logo.png の実際の色 */
const TONES = ["#e50014", "#000000"] as const;

/**
 * JQIT のロゴ。画面に入ると、散った粒が集まってロゴになる（1度だけ）。
 * - 画像そのものはサーバーで描いておく。粒は canvas に重ねて描き、集まり終えたら本物の画像に切り替えて canvas を捨てる。
 * - 画像は最初から CSS で隠しておく（globals.css の logo-particles）。ページを開いた時点で画面内にあっても、
 *   ちらつかずに再生できる。再読み込みでスクロール位置が戻ったときも再生する。
 * - JS が動かないときは CSS の安全弁で約3秒後に画像を出す。
 * - OS の「動きを減らす」設定（Windows の「アニメーション効果」オフ）でも再生する。業務用 PC では
 *   オフにしている人が多く、従うと演出が見えないため（2026-11-27 の判断。サイトのほかの演出は設定に従う）。
 * - three.js などは使わない（2D canvas だけ）。
 */
export function LogoParticles({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    if (typeof IntersectionObserver === "undefined") {
      wrap.dataset.logo = "done";
      return;
    }

    let canvas: HTMLCanvasElement | null = null;
    let raf = 0;
    let swapTimer = 0;
    let curtainTimer = 0;
    let finished = false;

    /** 途中でやめるときも、必ず画像が見える状態で終える */
    const finish = () => {
      if (finished) return;
      finished = true;
      io.disconnect();
      window.cancelAnimationFrame(raf);
      window.clearTimeout(swapTimer);
      window.clearTimeout(curtainTimer);
      window.removeEventListener("resize", finish);
      canvas?.remove();
      canvas = null;
      wrap.dataset.logo = "done";
    };

    const play = async () => {
      // ページ先頭に置くと、遷移の幕の裏で再生が終わってしまう。幕があれば抜けるまで待つ
      if (document.querySelector(".page-curtain")) {
        await new Promise<void>((resolve) => {
          curtainTimer = window.setTimeout(resolve, CURTAIN_WAIT_MS);
        });
        if (finished) return;
      }
      try {
        await img.decode();
      } catch {
        finish();
        return;
      }
      if (finished) return;

      const logoWidth = img.clientWidth;
      const logoHeight = img.clientHeight;
      const marginY = verticalRoom(wrap);
      const context = prepareCanvas(wrap, logoWidth, logoHeight, marginY);
      const built = buildParticles(img, logoWidth, logoHeight, marginY);
      if (!context || !built) {
        finish();
        return;
      }
      canvas = context.canvas;
      const { ctx, originX, originY } = context;
      const { particles, dotSize } = built;

      const frame: ParticleFrame = { x: 0, y: 0, alpha: 0, settle: 0 };
      const byTone = [particles.filter((p) => p.tone === 0), particles.filter((p) => p.tone === 1)];
      const start = performance.now();

      const draw = (now: number) => {
        const progress = Math.min(1, (now - start) / GATHER_MS);
        const time = (now - start) / 1000;
        ctx.clearRect(0, 0, context.width, context.height);
        byTone.forEach((group, tone) => {
          ctx.fillStyle = TONES[tone];
          for (const p of group) {
            particleAt(p, progress, time, frame);
            if (frame.alpha <= 0.01) continue;
            // 散っている間は細かい砂粒、集まり終えると隙間なく並ぶ大きさにする
            const size = dotSize * (0.55 + 0.45 * frame.settle);
            ctx.globalAlpha = frame.alpha;
            ctx.fillRect(originX + frame.x, originY + frame.y, size, size);
          }
        });

        if (progress < 1) {
          raf = window.requestAnimationFrame(draw);
          return;
        }
        // 粒のロゴから本物の画像へ、重ねたまま入れ替える（画像側のフェードは globals.css）
        wrap.dataset.logo = "done";
        context.canvas.style.transition = `opacity ${SWAP_MS}ms ease-out`;
        context.canvas.style.opacity = "0";
        swapTimer = window.setTimeout(finish, SWAP_MS + 50);
      };
      raf = window.requestAnimationFrame(draw);
    };

    // CSS の安全弁（約3秒後に画像を出す）を止め、画面に入るまで隠したままにする
    wrap.dataset.logo = "waiting";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        void play();
      },
      // 画面の下の端で始まると見逃すので、下から2割より上に来てから始める
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(wrap);
    // 途中で幅が変わったら、位置を計算し直さずに画像へ切り替える
    window.addEventListener("resize", finish);

    return finish;
  }, []);

  return (
    <div ref={wrapRef} className={`logo-particles relative w-fit ${className}`}>
      <Image
        ref={imgRef}
        src={LOGO.src}
        alt="株式会社JQIT"
        width={LOGO.width}
        height={LOGO.height}
        className="h-[52px] w-auto min-[720px]:h-[68px]"
      />
    </div>
  );
}

/**
 * ロゴより一回り大きい canvas を重ねる。横は画面の幅からはみ出さないように切る
 * （はみ出すとページが横にスクロールする）。
 */
function prepareCanvas(wrap: HTMLElement, logoWidth: number, logoHeight: number, marginY: number) {
  const rect = wrap.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const left = -Math.min(MARGIN_X, Math.max(0, rect.left));
  const right = logoWidth + Math.min(MARGIN_X, Math.max(0, viewportWidth - rect.left - logoWidth));
  const width = Math.max(1, Math.floor(right - left));
  const height = logoHeight + marginY * 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "absolute",
    left: `${left}px`,
    top: `${-marginY}px`,
    width: `${width}px`,
    height: `${height}px`,
    pointerEvents: "none",
  });
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(dpr, dpr);
  wrap.appendChild(canvas);
  return { canvas, ctx, width, height, originX: -left, originY: marginY };
}

/**
 * 粒を縦に散らせる幅。ロゴを置いた帯（section）の上下の余白より広くしない。
 * 帯が overflow:hidden のとき（ページ先頭の帯）に、散った粒が帯の縁で切れて見えるのを防ぐ。
 */
function verticalRoom(wrap: HTMLElement): number {
  const band = wrap.closest("section");
  if (!band) return MARGIN_Y;
  const rect = wrap.getBoundingClientRect();
  const bandRect = band.getBoundingClientRect();
  const room = Math.min(rect.top - bandRect.top, bandRect.bottom - rect.bottom);
  return Math.round(Math.min(MARGIN_Y, Math.max(MIN_MARGIN_Y, room)));
}

function buildParticles(
  img: HTMLImageElement,
  logoWidth: number,
  logoHeight: number,
  marginY: number,
): { particles: LogoParticle[]; dotSize: number } | null {
  if (!logoWidth || !logoHeight) return null;
  // 表示する大きさの2倍で描いてから拾う（縁のにじみを粒の濃さに反映させる）
  const density = 2;
  const width = Math.round(logoWidth * density);
  const height = Math.round(logoHeight * density);
  const buffer = document.createElement("canvas");
  buffer.width = width;
  buffer.height = height;
  const ctx = buffer.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);

  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 32) opaque += 1;
  if (!opaque) return null;

  // 粒の間隔（CSS px）。高精細な画面では細かく拾う
  const gap = window.devicePixelRatio > 1 ? 1 : 1.5;
  const step = stepForLimit(opaque, gap * density, MAX_PARTICLES);
  const particles = sampleLogoParticles(data, width, height, {
    step,
    scale: 1 / density,
    scatter: { minX: 40, maxX: MARGIN_X * 0.9, minY: 20, maxY: marginY * 0.9 },
  });
  return { particles, dotSize: step / density };
}
