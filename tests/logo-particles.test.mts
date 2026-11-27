import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  particleAt,
  sampleLogoParticles,
  stepForLimit,
  type ParticleFrame,
} from "../lib/logo-particles.ts";

/** 4×2 の画像。左上が赤、その右が黒、右下が半透明の黒、ほかは透明 */
function fixture() {
  const data = new Uint8ClampedArray(4 * 2 * 4);
  data.set([229, 0, 20, 255], 0);
  data.set([0, 0, 0, 255], 4);
  data.set([0, 0, 0, 128], (1 * 4 + 3) * 4);
  return data;
}

/** 決まった列を返す乱数 */
function seeded() {
  let n = 0;
  return () => ((n = (n * 9301 + 49297) % 233280) / 233280);
}

const scatter = { minX: 40, maxX: 150, minY: 20, maxY: 70 };
const sample = () =>
  sampleLogoParticles(fixture(), 4, 2, { step: 1, scale: 0.5, scatter, random: seeded() });

test("透明な画素は粒にせず、赤と黒を分ける", () => {
  const particles = sample();
  assert.equal(particles.length, 3);
  assert.deepEqual(
    particles.map((p) => p.tone),
    [0, 1, 1],
  );
  assert.deepEqual([particles[2].homeX, particles[2].homeY], [1.5, 0.5]);
  assert.ok(Math.abs(particles[2].alpha - 128 / 255) < 1e-9);
});

test("集まり終えると、すべての粒が元の位置に元の濃さで並ぶ", () => {
  const out: ParticleFrame = { x: 0, y: 0, alpha: 0, settle: 0 };
  for (const p of sample()) {
    particleAt(p, 1, 3.3, out);
    assert.ok(Math.abs(out.x - p.homeX) < 1e-9);
    assert.ok(Math.abs(out.y - p.homeY) < 1e-9);
    assert.ok(Math.abs(out.alpha - p.alpha) < 1e-9);
    assert.equal(out.settle, 1);
  }
});

test("始まりでは粒が見えず、散る範囲の外へは出ない", () => {
  const out: ParticleFrame = { x: 0, y: 0, alpha: 0, settle: 0 };
  for (const p of sample()) {
    particleAt(p, 0, 0, out);
    assert.equal(out.alpha, 0);
    assert.ok(Math.abs(p.offsetX) <= scatter.maxX && Math.abs(p.offsetY) <= scatter.maxY);
    assert.ok(p.distance >= 0 && p.distance <= 1);
    assert.ok(p.stagger >= 0 && p.stagger <= 0.9);
  }
});

test("粒の数が上限を超えない間隔を選ぶ", () => {
  assert.equal(stepForLimit(8000, 2, 9000), 2);
  const step = stepForLimit(200000, 2, 9000);
  assert.ok(200000 / (step * step) <= 9000);
  assert.ok(200000 / ((step - 1) * (step - 1)) > 9000);
});

test("ロゴの部品は動きを減らす設定を尊重し、three.js を持ち込まない", () => {
  const source = readFileSync("components/about/LogoParticles.tsx", "utf8");
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(source, /from "three"|from "gsap"/);
  assert.doesNotMatch(readFileSync("package.json", "utf8"), /"three"|"gsap"/);
});
