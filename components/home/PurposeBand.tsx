import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";

/** 全幅フォトバンド: オフィス写真の上に Purpose を重ねる */
export function PurposeBand() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/natural-tech-wide.webp"
        alt="自然素材とテクノロジーが共存するJQITのオフィス"
        width={1915}
        height={821}
        sizes="100vw"
        data-photo-slide
        className="h-[320px] w-full object-cover object-[32%_center] min-[720px]:h-[400px]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink/45 via-ink/25 to-ink/10"
      />
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-[1160px] px-6">
          <FadeIn>
            {/* 写真の明暗ムラに左右されないよう、テキスト全体を均一なパネルで覆う */}
            <div className="inline-block rounded-card bg-ink/70 px-7 py-6 backdrop-blur-[2px] min-[720px]:px-9 min-[720px]:py-8">
              <p className="mb-4 inline-flex items-center gap-2.5">
                <span aria-hidden className="inline-block h-0.5 w-6 bg-brand" />
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/70">
                  Our Purpose
                </span>
              </p>
              <p className="palt text-[24px] font-bold leading-[1.6] tracking-[-0.02em] text-white min-[720px]:text-[32px]">
                成長機会の最大化と、
                <br />
                社会への貢献。
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
