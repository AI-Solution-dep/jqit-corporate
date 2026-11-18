import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { siteConfig } from "@/lib/site-config";

const channels = [
  {
    label: "Qiita",
    en: "Tech Articles",
    description: "AI・LLM・Claude Code など、現場で得た技術知見をエンジニアが発信。",
    href: siteConfig.links.qiita,
  },
  {
    label: "note",
    en: "Culture & Story",
    description: "働く人とカルチャー、採用の裏側をストーリーで届けます。",
    href: siteConfig.links.note,
  },
  {
    label: "X",
    en: "Updates",
    description: "リリースやイベントなど、JQITの最新情報をお知らせ。",
    href: siteConfig.links.x,
  },
  {
    label: "Instagram",
    en: "Daily",
    description: "オフィスの日常や社内イベントの様子を写真でシェア。",
    href: siteConfig.links.instagram,
  },
];

export function TechCultureSection() {
  return (
    <section id="tech-culture" className="overflow-hidden bg-ink py-20 text-white min-[720px]:py-24">
      <Container>
        <FadeIn className="mb-12 max-w-[680px]">
          <p className="mb-4 inline-flex items-center gap-2.5">
            <span aria-hidden className="inline-block h-0.5 w-6 bg-brand" />
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/50">
              Tech & Culture
            </span>
          </p>
          <h2 className="palt text-[28px] font-bold leading-[1.4] tracking-[-0.02em] min-[720px]:text-[38px]">
            技術を、<span className="text-brand">発信する</span>会社であること。
          </h2>
          <p className="mt-6 text-[15px] leading-[2.1] text-white/70">
            学んだ知見は現場に留めず、社外へ。エンジニアの記事・カルチャーの発信を通じて、開かれた技術者集団であり続けます。
          </p>
        </FadeIn>
        <FadeIn className="grid grid-cols-1 gap-px border border-white/15 bg-white/15 min-[600px]:grid-cols-2 min-[1024px]:grid-cols-4">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 bg-ink p-7 transition-colors hover:bg-[#1d1d17]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm">
                {c.en}
              </p>
              <p className="font-en text-[22px] font-semibold tracking-[-0.01em]">
                {c.label}
                <span
                  aria-hidden
                  className="ml-2 inline-block font-mono text-sm text-white/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-warm-ink"
                >
                  ↗
                </span>
              </p>
              <p className="text-[13px] leading-[1.9] text-white/60">{c.description}</p>
            </a>
          ))}
        </FadeIn>
        <FadeIn className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-white/15 pt-7">
          <p className="text-sm leading-relaxed text-white/70">
            一緒に働く仲間を募集しています。
          </p>
          <a
            href={siteConfig.links.recruit}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.12em] text-white transition-colors hover:text-warm"
          >
            採用サイトへ
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </a>
        </FadeIn>
      </Container>
    </section>
  );
}
