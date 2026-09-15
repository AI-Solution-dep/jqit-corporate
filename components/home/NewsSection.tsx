import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { DisplayText } from "@/components/ui/DisplayText";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";
import { formatNewsDate, getNewsList } from "@/lib/microcms";
import { isInstagramRepost } from "@/lib/news-seo-overrides";

function isBadgeImage(src: string): boolean {
  return src.startsWith("/badges/");
}

export async function NewsSection() {
  // Instagram 投稿の転記（採用広報）はトップに出さない。除外で4件を割らないよう多めに取る
  const news = (await getNewsList({ limit: 20 }))
    .filter((n) => !isInstagramRepost(n))
    .slice(0, 4);

  return (
    <section id="news" className="overflow-hidden bg-paper py-20 min-[720px]:py-[96px]">
      <Container>
        <div className="grid grid-cols-1 gap-10 min-[900px]:grid-cols-[0.75fr_1.25fr] min-[900px]:gap-16">
          {/* 左: 見出しブロック（編集型の非対称レイアウト） */}
          <FadeIn>
            <DisplayText className="-ml-1 mb-11">NEWS</DisplayText>
            <Kicker className="mb-3.5">News</Kicker>
            <h2 className="palt text-[26px] font-bold tracking-[-0.02em] text-ink min-[720px]:text-[34px]">
              お知らせ
            </h2>
            <p className="mt-4 max-w-[300px] text-sm leading-[1.95] text-muted">
              プレスリリース・イベント・社内の取り組みなど、JQITの「今」をお届けします。
            </p>
            <Link
              href="/news"
              className="group mt-7 inline-flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.12em] text-ink transition-colors hover:text-brand"
            >
              すべてのニュース
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </FadeIn>

          {/* 右: 記事リスト */}
          <FadeIn className="self-end border-t border-line">
            {news.map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.id}`}
                className="group grid grid-cols-[auto_auto_1fr] items-center gap-x-4 gap-y-3 border-b border-line px-1 py-[18px] transition-colors hover:bg-cream min-[720px]:grid-cols-[84px_112px_96px_1fr_auto] min-[720px]:gap-5 min-[720px]:py-[22px]"
              >
                {n.eyecatch ? (
                  <span className="relative col-span-3 block aspect-[16/10] overflow-hidden bg-cream min-[720px]:col-span-1 min-[720px]:h-[52px] min-[720px]:w-[78px]">
                    <Image
                      src={n.eyecatch.url}
                      alt=""
                      fill
                      sizes="(min-width: 720px) 78px, 100vw"
                      className={`transition-transform duration-500 group-hover:scale-105 ${
                        isBadgeImage(n.eyecatch.url) ? "object-contain p-2" : "object-cover"
                      }`}
                    />
                  </span>
                ) : (
                  <span className="hidden h-[52px] w-[78px] bg-cream min-[720px]:block" />
                )}
                <span className="font-mono text-[13px] tracking-[0.06em] text-muted">
                  {formatNewsDate(n.date)}
                </span>
                <span className="justify-self-start rounded-card border border-brand px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-brand">
                  {n.category}
                </span>
                <span className="col-span-3 text-[15px] leading-[1.7] text-ink min-[720px]:col-span-1">
                  {n.title}
                </span>
                <span
                  aria-hidden
                  className="hidden font-mono text-sm text-[#c9c6c0] min-[720px]:block"
                >
                  →
                </span>
              </Link>
            ))}
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
