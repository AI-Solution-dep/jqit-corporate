/**
 * 子ページの背景の図形（1ページに1つ。最初から最後まで画面についてくる）。
 * - 形は正円・正方形・正三角形だけ。崩しは大きさの差・傾き・画面の外へのはみ出しで作る。
 * - 途中で別の模様に差し替えない（地が別物に変わって見えるため）。ページごとに組み合わせを変えて変化を出す。
 * - 塗りの図形に、枠線だけの図形を1つ混ぜて軽さを出す（線の図形を増やしすぎない）。
 *   枠線は太め（PC 約10px・スマホ 6px）。細いと「線の模様」に見えて塗りの図形と釣り合わない。
 * - 色はかなり薄く、存在感は控えめにする（2026-11-18、さらに約半分に下げた）。動きの速さと量は「普通に気づく」程度にする（控えめにしない）。
 * 図形は、ページ上部の見出し帯（PageHeader）や TOP のヒーローの下から出す（data-backdrop-after の付いた帯）。
 * /introduction（専用デザイン）は対象外。
 */
export type BackdropKind = "circle" | "square" | "triangle";
export type BackdropTone = "red" | "pink" | "warm";
export type BackdropShape = {
  kind: BackdropKind;
  tone: BackdropTone;
  /** 色の濃さ（0〜1）。薄めにする */
  alpha: number;
  /** 枠線だけで描く（中は塗らない）。各ページで大きな図形の1つだけに使う */
  outline?: boolean;
  /** 画面に対する位置と大きさ（vw / vh）。はみ出してよい */
  left: number;
  top: number;
  size: number;
  rotate?: number;
  /** 動く向き（x=左右、y=上下）・1往復の秒数・逆向きから動き出すか */
  axis: "x" | "y";
  dur: number;
  reverse?: boolean;
};

export const backdropTones: Record<BackdropTone, string> = {
  red: "230 0 18",
  pink: "238 140 160",
  warm: "205 172 128",
};

/* ページごとに、配置（左右・上下・中央）・色・どれを枠線にするか・大きさ・傾き・動く向きを個別に変える。
   同じ並び（例：右に赤系の塗り・左に茶の枠線）を繰り返さない。 */
const home: BackdropShape[] = [
  { kind: "triangle", tone: "red", alpha: 0.04, left: 6, top: 8, size: 46, rotate: 8, axis: "x", dur: 11 },
  { kind: "circle", tone: "pink", alpha: 0.16, outline: true, left: 66, top: 44, size: 40, axis: "y", dur: 9, reverse: true },
];

const about: BackdropShape[] = [
  { kind: "circle", tone: "warm", alpha: 0.1, left: -18, top: 10, size: 52, axis: "y", dur: 10 },
  { kind: "square", tone: "pink", alpha: 0.16, outline: true, left: 70, top: 52, size: 30, rotate: 14, axis: "x", dur: 8, reverse: true },
  { kind: "triangle", tone: "red", alpha: 0.035, left: 52, top: 4, size: 14, rotate: -10, axis: "y", dur: 7 },
];

const vision: BackdropShape[] = [
  { kind: "square", tone: "pink", alpha: 0.06, left: 30, top: 58, size: 44, rotate: 22, axis: "x", dur: 11 },
  { kind: "circle", tone: "red", alpha: 0.12, outline: true, left: 72, top: -6, size: 36, axis: "y", dur: 9, reverse: true },
  { kind: "circle", tone: "warm", alpha: 0.12, left: 2, top: 18, size: 10, axis: "x", dur: 6 },
];

const it: BackdropShape[] = [
  { kind: "square", tone: "warm", alpha: 0.11, left: 62, top: 40, size: 48, rotate: 8, axis: "x", dur: 10 },
  { kind: "triangle", tone: "pink", alpha: 0.16, outline: true, left: -10, top: 2, size: 34, rotate: 18, axis: "y", dur: 9, reverse: true },
  { kind: "square", tone: "red", alpha: 0.035, left: 20, top: 72, size: 10, rotate: -12, axis: "y", dur: 7 },
];

const ai: BackdropShape[] = [
  { kind: "triangle", tone: "pink", alpha: 0.07, left: -12, top: 30, size: 54, rotate: -6, axis: "x", dur: 12 },
  { kind: "circle", tone: "warm", alpha: 0.16, outline: true, left: 58, top: 8, size: 42, axis: "y", dur: 10, reverse: true },
  { kind: "triangle", tone: "red", alpha: 0.035, left: 80, top: 70, size: 11, rotate: 20, axis: "x", dur: 6 },
];

const works: BackdropShape[] = [
  { kind: "square", tone: "pink", alpha: 0.05, left: 56, top: -10, size: 40, rotate: -16, axis: "y", dur: 9 },
  { kind: "triangle", tone: "warm", alpha: 0.16, outline: true, left: 8, top: 50, size: 36, rotate: 6, axis: "x", dur: 11, reverse: true },
  { kind: "circle", tone: "red", alpha: 0.035, left: 84, top: 62, size: 9, axis: "y", dur: 7 },
];

const news: BackdropShape[] = [
  { kind: "circle", tone: "red", alpha: 0.03, left: 40, top: 40, size: 46, axis: "x", dur: 12 },
  { kind: "square", tone: "warm", alpha: 0.16, outline: true, left: 74, top: 4, size: 26, rotate: 24, axis: "y", dur: 8, reverse: true },
  { kind: "triangle", tone: "pink", alpha: 0.06, left: -6, top: 6, size: 18, rotate: -8, axis: "x", dur: 7 },
];

const column: BackdropShape[] = [
  { kind: "triangle", tone: "warm", alpha: 0.1, left: 60, top: 20, size: 46, rotate: 14, axis: "y", dur: 10 },
  { kind: "circle", tone: "pink", alpha: 0.14, outline: true, left: -16, top: 44, size: 44, axis: "x", dur: 12, reverse: true },
  { kind: "square", tone: "red", alpha: 0.03, left: 24, top: 8, size: 10, rotate: 8, axis: "y", dur: 6 },
];

const contact: BackdropShape[] = [
  { kind: "circle", tone: "warm", alpha: 0.09, left: 10, top: 54, size: 40, axis: "y", dur: 10 },
  { kind: "triangle", tone: "pink", alpha: 0.14, outline: true, left: 70, top: 6, size: 30, rotate: -12, axis: "x", dur: 9, reverse: true },
];

const privacy: BackdropShape[] = [
  { kind: "square", tone: "pink", alpha: 0.05, left: 66, top: 48, size: 34, rotate: -6, axis: "y", dur: 11 },
  { kind: "circle", tone: "warm", alpha: 0.15, outline: true, left: -12, top: 2, size: 32, axis: "x", dur: 9, reverse: true },
];

const security: BackdropShape[] = [
  { kind: "triangle", tone: "warm", alpha: 0.09, left: -8, top: 44, size: 38, rotate: 12, axis: "x", dur: 10 },
  { kind: "square", tone: "red", alpha: 0.1, outline: true, left: 72, top: 10, size: 24, rotate: 18, axis: "y", dur: 8, reverse: true },
];

/** パスの先頭一致で選ぶ。上から順に判定する。 */
const rules: { prefix: string; shapes: BackdropShape[] }[] = [
  { prefix: "/business/it-solutions", shapes: it },
  { prefix: "/business/ai-solutions", shapes: ai },
  { prefix: "/about", shapes: about },
  { prefix: "/corporate-vision", shapes: vision },
  { prefix: "/works", shapes: works },
  { prefix: "/news", shapes: news },
  { prefix: "/column", shapes: column },
  { prefix: "/contact", shapes: contact },
  { prefix: "/privacy-policy", shapes: privacy },
  { prefix: "/security-policy", shapes: security },
];

export function backdropFor(pathname: string): BackdropShape[] | null {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/") return home;
  return rules.find(({ prefix }) => path === prefix || path.startsWith(`${prefix}/`))?.shapes ?? null;
}
