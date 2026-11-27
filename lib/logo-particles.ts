/**
 * ロゴの画素を「粒」に変え、散った位置から元の位置へ集める計算。
 * 描画（canvas）と分けてあるのは、ここだけをテストで確かめるため。
 * 使う側は components/about/LogoParticles.tsx。
 */

export type LogoParticle = {
  /** 集まり終えたときの位置（ロゴ左上からの CSS px） */
  homeX: number;
  homeY: number;
  /** 散っているときのずれ（CSS px） */
  offsetX: number;
  offsetY: number;
  /** ずれの大きさを散る範囲で割った値（0〜1）。遠い粒ほど薄くするのに使う */
  distance: number;
  /** 動き出しの遅れ（0〜0.9） */
  stagger: number;
  /** ゆらぎ・きらめきの位相 */
  phase: number;
  /** 元の画素の不透明度（0〜1） */
  alpha: number;
  /** 0 = 赤（輪）、1 = 黒（文字と輪の一部） */
  tone: 0 | 1;
};

export type ScatterRange = {
  /** 散る距離の下限と上限（CSS px） */
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type SampleOptions = {
  /** 何画素おきに拾うか（画像の画素単位） */
  step: number;
  /** 画像の1画素が CSS で何 px になるか */
  scale: number;
  scatter: ScatterRange;
  /** 0 以上 1 未満の乱数。テストでは固定の列を渡す */
  random?: () => number;
};

const ALPHA_THRESHOLD = 32;

/** 赤か黒かの判定。ロゴは #e50014 の赤と黒の2色だけ */
function toneOf(r: number, g: number, b: number): 0 | 1 {
  return r - Math.max(g, b) > 60 ? 0 : 1;
}

/**
 * 画像の画素（RGBA）から粒をつくる。透明な画素は拾わない。
 */
export function sampleLogoParticles(
  data: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  { step, scale, scatter, random = Math.random }: SampleOptions,
): LogoParticle[] {
  const stride = Math.max(1, Math.round(step));
  const particles: LogoParticle[] = [];
  // 動き出しの遅れに使う、ゆるやかなむら（近い粒どうしは近い値になる）
  const seedA = random() * Math.PI * 2;
  const seedB = random() * Math.PI * 2;

  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const i = (y * width + x) * 4;
      const a = data[i + 3];
      if (a <= ALPHA_THRESHOLD) continue;

      const angle = random() * Math.PI * 2;
      // 二乗して中心寄りを密に、外側を疎にする（一様だと散った範囲の輪郭が見える）
      const bias = random() ** 2;
      const rangeX = scatter.minX + (scatter.maxX - scatter.minX) * bias;
      const rangeY = scatter.minY + (scatter.maxY - scatter.minY) * bias;
      const offsetX = Math.cos(angle) * rangeX;
      const offsetY = Math.sin(angle) * rangeY;

      const u = x / width;
      const v = y / height;
      const noise = 0.5 + 0.5 * Math.sin(u * 9 + seedA) * Math.cos(v * 5 + seedB);
      // 横の位置には寄せない。寄せると「左から順に集まる」動きに見える
      const stagger = Math.min(0.9, Math.max(0, v * 0.1 + noise * 0.3));

      particles.push({
        homeX: x * scale,
        homeY: y * scale,
        offsetX,
        offsetY,
        distance: Math.min(1, Math.hypot(offsetX / scatter.maxX, offsetY / scatter.maxY)),
        stagger,
        phase: random() * Math.PI * 2,
        alpha: a / 255,
        tone: toneOf(data[i], data[i + 1], data[i + 2]),
      });
    }
  }
  return particles;
}

/**
 * 粒の数が上限を超えない、拾う間隔（画像の画素単位）を返す。
 * @param opaquePixels 透明でない画素の数
 */
export function stepForLimit(opaquePixels: number, minStep: number, maxParticles: number): number {
  let step = Math.max(1, Math.round(minStep));
  while (opaquePixels / (step * step) > maxParticles) step += 1;
  return step;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export type ParticleFrame = { x: number; y: number; alpha: number; settle: number };

/** 散った粒がふわふわ動く幅（CSS px） */
const WAVE = 1.2;
/** これより外にある粒は見せない（散った範囲の四角い縁を出さないため） */
const FADE_START = 0.25;

/**
 * ある時点の粒の位置と濃さ。
 * @param progress 全体の進み具合。0 = 散っている、1 = 集まり終えた
 * @param time 経過秒（ゆらぎときらめきに使う）
 * @param out 書き込み先（毎フレームの割り当てを避ける）
 */
export function particleAt(
  p: LogoParticle,
  progress: number,
  time: number,
  out: ParticleFrame,
): ParticleFrame {
  const eased = 1 - (1 - progress) ** 2;
  const own = Math.min(1, Math.max(0, (eased - p.stagger) / (1 - p.stagger)));
  // spread: 1 = 散っている、0 = 元の位置
  const spread = 1 - own ** 3;

  // ゆらぎは集まり終えると 0 になる。残ると粒がずれてロゴの形が崩れる
  out.x = p.homeX + p.offsetX * spread + WAVE * spread * Math.sin(time * 0.6 + p.phase);
  out.y = p.homeY + p.offsetY * spread + WAVE * spread * Math.sin(time * 0.5 + p.phase * 1.5 + 1.57);

  const glitterRaw = (Math.sin(time * 6 + p.phase * 40) + 1) * 0.5;
  const glitter = glitterRaw + (1 - glitterRaw) * (1 - spread);
  out.alpha =
    p.alpha *
    glitter *
    (1 - smoothstep(FADE_START, 1, p.distance * spread)) *
    smoothstep(0, 0.02, 1 - spread);
  out.settle = 1 - spread;
  return out;
}
