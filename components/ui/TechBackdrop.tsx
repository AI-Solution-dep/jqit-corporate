/**
 * セクション背景の幾何学装飾。微細ドットグリッド＋赤の走査線。
 * position:relative + overflow:hidden の親の中に置く。
 */
export function TechBackdrop() {
  return (
    <div aria-hidden data-tech-backdrop className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* ドットグリッド（右上・左下にフェード配置） */}
      <div
        className="tech-dots absolute -top-10 right-0 h-[340px] w-[420px] opacity-60"
        style={{
          maskImage: "radial-gradient(closest-side, #000 30%, transparent)",
          WebkitMaskImage: "radial-gradient(closest-side, #000 30%, transparent)",
        }}
      />
      <div
        className="tech-dots absolute -bottom-16 -left-10 h-[280px] w-[360px] opacity-40"
        style={{
          maskImage: "radial-gradient(closest-side, #000 30%, transparent)",
          WebkitMaskImage: "radial-gradient(closest-side, #000 30%, transparent)",
        }}
      />
      {/* 赤の走査線（上端） */}
      <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
        <div className="tech-scan h-full w-1/3 bg-gradient-to-r from-transparent via-brand to-transparent" />
      </div>
    </div>
  );
}
