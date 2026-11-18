import Image from "next/image";
import Link from "next/link";

/**
 * 事業詳細ページ末尾に置く「もうひとつの事業」への全幅写真バンド。
 * トップの写真交互パネルと同じ編集言語（写真×赤アクセント）で
 * 事業2ページを回遊させる。
 */
export function NextBusinessBand({
  en,
  title,
  href,
  image,
  alt,
}: {
  en: string;
  title: string;
  href: string;
  image: string;
  alt: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block h-[280px] overflow-hidden border-t border-line min-[720px]:h-[340px]"
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="100vw"
        data-photo-slide
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
      />
      <div aria-hidden className="absolute inset-0 bg-ink/60 transition-colors duration-500 group-hover:bg-ink/50" />
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-[1160px] px-6">
          <p className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            <span aria-hidden className="h-px w-6 bg-warm" />
            Next — {en}
          </p>
          <p className="palt flex flex-wrap items-center gap-x-5 gap-y-2 text-[28px] font-bold leading-[1.35] tracking-[-0.02em] text-white min-[720px]:text-[38px]">
            {title}
            <span
              aria-hidden
              className="font-mono text-[24px] text-warm-ink transition-transform duration-300 group-hover:translate-x-2 min-[720px]:text-[30px]"
            >
              →
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
