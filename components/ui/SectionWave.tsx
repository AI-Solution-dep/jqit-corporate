const tones = { paper: "#ffffff", blush: "#fff0f3", warm: "#f3f0eb" };

/** 前後の背景色を曲線でつなぐ。本文・写真の上には重ねない。 */
export function SectionWave({ from, to, reverse = false }: { from: keyof typeof tones; to: keyof typeof tones; reverse?: boolean }) {
  return <div className="jqit-wave-divider" aria-hidden="true" style={{ backgroundColor: tones[to] }}>
    <svg viewBox="0 0 1440 72" preserveAspectRatio="none" focusable="false">
      <path d={reverse ? "M0 35C250-8 446 2 718 36S1190 84 1440 26V-2H0Z" : "M0 22C250 83 490 77 750 37S1215-6 1440 25V-2H0Z"} fill={tones[from]} />
    </svg>
  </div>;
}
