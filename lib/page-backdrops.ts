/**
 * 子ページの背景の図形（1ページに1つ。最初から最後まで画面についてくる）。
 * - 形は正円・正方形・正三角形だけ。崩しは大きさの差・傾き・画面の外へのはみ出しで作る。
 * - 途中で別の模様に差し替えない（地が別物に変わって見えるため）。ページごとに組み合わせを変えて変化を出す。
 * - 塗りの図形に、枠線だけの図形を1つ混ぜて軽さを出す（線の図形を増やしすぎない）。
 *   枠線は太め（PC 約10px・スマホ 6px）。細いと「線の模様」に見えて塗りの図形と釣り合わない。
 * - 色は薄く、存在感は控えめにする。動きの速さと量は「普通に気づく」程度にする（控えめにしない）。
 * TOP（独自のヒーロー演出）と /introduction（専用デザイン）は対象外。
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

/** 円が主役（会社・方針系） */
const circleLed: BackdropShape[] = [
  { kind: "circle", tone: "pink", alpha: 0.12, left: 60, top: 6, size: 54, axis: "y", dur: 9 },
  { kind: "square", tone: "warm", alpha: 0.32, outline: true, left: -16, top: 46, size: 40, rotate: -8, axis: "x", dur: 11, reverse: true },
  { kind: "triangle", tone: "red", alpha: 0.07, left: 40, top: 70, size: 12, rotate: 12, axis: "x", dur: 7 },
];

/** 四角が主役（IT事業） */
const squareLed: BackdropShape[] = [
  { kind: "square", tone: "warm", alpha: 0.22, left: 58, top: 10, size: 46, rotate: 10, axis: "x", dur: 10 },
  { kind: "circle", tone: "pink", alpha: 0.24, outline: true, left: -14, top: 44, size: 38, axis: "y", dur: 9, reverse: true },
  { kind: "square", tone: "red", alpha: 0.06, left: 36, top: 76, size: 10, rotate: -14, axis: "y", dur: 7 },
];

/** 三角が主役（AI事業） */
const triangleLed: BackdropShape[] = [
  { kind: "triangle", tone: "pink", alpha: 0.14, left: 54, top: 8, size: 52, rotate: 10, axis: "x", dur: 10 },
  { kind: "circle", tone: "warm", alpha: 0.32, outline: true, left: -12, top: 40, size: 36, axis: "y", dur: 10, reverse: true },
  { kind: "square", tone: "red", alpha: 0.05, left: 8, top: 12, size: 9, rotate: 14, axis: "y", dur: 7 },
];

/** 一覧・記事（実績・ニュース・コラム）。本文を読む場所なので大きい図形を端に寄せる */
const listing: BackdropShape[] = [
  { kind: "circle", tone: "warm", alpha: 0.2, left: 66, top: 18, size: 46, axis: "y", dur: 10 },
  { kind: "triangle", tone: "pink", alpha: 0.24, outline: true, left: -18, top: 50, size: 40, rotate: -12, axis: "x", dur: 11, reverse: true },
  { kind: "circle", tone: "red", alpha: 0.06, left: 84, top: 74, size: 9, axis: "x", dur: 7 },
];

/** お問い合わせ・規約。フォームや本文の邪魔をしないよう、図形を端に寄せて数を絞る */
const quiet: BackdropShape[] = [
  { kind: "circle", tone: "pink", alpha: 0.1, left: 70, top: 10, size: 44, axis: "y", dur: 10 },
  { kind: "square", tone: "warm", alpha: 0.3, outline: true, left: -20, top: 56, size: 34, rotate: -10, axis: "x", dur: 12, reverse: true },
];

/** パスの先頭一致で選ぶ。上から順に判定する。 */
const rules: { prefix: string; shapes: BackdropShape[] }[] = [
  { prefix: "/business/it-solutions", shapes: squareLed },
  { prefix: "/business/ai-solutions", shapes: triangleLed },
  { prefix: "/about", shapes: circleLed },
  { prefix: "/corporate-vision", shapes: circleLed },
  { prefix: "/works", shapes: listing },
  { prefix: "/news", shapes: listing },
  { prefix: "/column", shapes: listing },
  { prefix: "/contact", shapes: quiet },
  { prefix: "/privacy-policy", shapes: quiet },
  { prefix: "/security-policy", shapes: quiet },
];

export function backdropFor(pathname: string): BackdropShape[] | null {
  const path = pathname.replace(/\/$/, "") || "/";
  return rules.find(({ prefix }) => path === prefix || path.startsWith(`${prefix}/`))?.shapes ?? null;
}
