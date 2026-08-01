import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatNewsDate, getNewsDetail, getNewsList, type News } from "@/lib/microcms";
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  createDescription,
  createPageMetadata,
  plainTextFromHtml,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

function newsDates(news: { date: string; updatedAt?: string }) {
  const publishedTime = news.date;
  const modifiedTime =
    news.updatedAt && news.updatedAt > publishedTime ? news.updatedAt : publishedTime;
  return { publishedTime, modifiedTime };
}

function newsDescription(news: News): string {
  const body = plainTextFromHtml(news.excerpt ?? news.body);
  const fallback = `${news.title}について、株式会社JQITからお知らせします。${news.category}情報と当社の最新の取り組みをご案内します。`;
  const source = body.length >= 50 ? body : `${body} ${fallback}`.trim();
  return createDescription(source, fallback);
}

function newsAuthor(news: News) {
  const authorName = news.authorName ?? siteConfig.name;
  const authorRole = news.authorRole ?? (authorName === siteConfig.name ? "広報" : undefined);
  const jsonLd =
    authorName === siteConfig.name
      ? {
          "@type": "Organization",
          "@id": `${siteConfig.url}/#organization`,
          name: siteConfig.name,
        }
      : {
          "@type": "Person",
          name: authorName,
          ...(authorRole ? { jobTitle: authorRole } : {}),
          worksFor: { "@id": `${siteConfig.url}/#organization` },
        };

  return { authorName, authorRole, jsonLd };
}

function isBadgeImage(src: string): boolean {
  return src.startsWith("/badges/");
}

/** ビルド時に既知の記事を事前生成（未知IDは通常ビルドではISRで都度生成） */
export async function generateStaticParams() {
  const news = await getNewsList({ limit: 100 });
  return news.map((n) => ({ id: n.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const news = await getNewsDetail(id);
  if (!news) return { title: "ニュース" };
  const description = newsDescription(news);
  const { publishedTime, modifiedTime } = newsDates(news);

  return createPageMetadata({
    title: news.title,
    description,
    path: `/news/${news.id}`,
    type: "article",
    image: news.eyecatch
      ? {
          url: news.eyecatch.url,
          width: news.eyecatch.width,
          height: news.eyecatch.height,
          alt: news.title,
        }
      : undefined,
    publishedTime,
    modifiedTime,
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const news = await getNewsDetail(id);
  if (!news) notFound();

  const related = (await getNewsList({ limit: 4 }))
    .filter((n) => n.id !== news.id)
    .slice(0, 3);
  const shareHref = `https://x.com/intent/post?text=${encodeURIComponent(
    `${news.title}｜${siteConfig.name}`,
  )}&url=${encodeURIComponent(`${siteConfig.url}/news/${news.id}`)}`;
  const articleUrl = absoluteUrl(`/news/${news.id}`);
  const description = newsDescription(news);
  const { publishedTime, modifiedTime } = newsDates(news);
  const { authorName, authorRole, jsonLd: authorJsonLd } = newsAuthor(news);
  const publishedDate = publishedTime.slice(0, 10);
  const modifiedDate = modifiedTime.slice(0, 10);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${articleUrl}#article`,
        mainEntityOfPage: articleUrl,
        headline: news.title,
        description,
        image: news.eyecatch ? [absoluteUrl(news.eyecatch.url)] : undefined,
        datePublished: publishedTime,
        dateModified: modifiedTime,
        inLanguage: "ja-JP",
        author: authorJsonLd,
        publisher: {
          "@type": "Organization",
          "@id": `${siteConfig.url}/#organization`,
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/jqit-logo.png`,
            width: 425,
            height: 118,
          },
        },
      },
      createBreadcrumbJsonLd([
        { name: "ホーム", path: "/" },
        { name: "ニュース", path: "/news" },
        { name: news.title, path: `/news/${news.id}` },
      ]),
    ],
  } satisfies Record<string, unknown>;

  return (
    <>
      <JsonLd data={articleJsonLd} />
      {/* 記事詳細は記事タイトルが主役。汎用PageHeaderは使わずパンくずのみの軽量帯にする */}
      <div className="border-b border-line bg-cream">
        <Container>
          <nav
            aria-label="パンくずリスト"
            className="py-6 font-mono text-[11px] tracking-[0.14em] text-muted"
          >
            <Link href="/" className="transition-colors hover:text-brand">
              HOME
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <Link href="/news" className="transition-colors hover:text-brand">
              NEWS
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span
              aria-current="page"
              className="inline-block max-w-[24em] truncate align-bottom font-sans tracking-normal"
            >
              {news.title}
            </span>
          </nav>
        </Container>
      </div>

      <section className="bg-paper pb-24 pt-12 min-[720px]:pt-14">
        <Container className="max-w-[860px]">
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <time
              dateTime={publishedDate}
              className="font-mono text-[13px] tracking-[0.06em] text-muted"
            >
              公開 {formatNewsDate(publishedDate)}
            </time>
            {modifiedDate > publishedDate && (
              <time
                dateTime={modifiedTime}
                className="font-mono text-[13px] tracking-[0.06em] text-muted"
              >
                更新 {formatNewsDate(modifiedDate)}
              </time>
            )}
            <span className="rounded-card border border-brand px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-brand">
              {news.category}
            </span>
          </div>
          <h1 className="palt border-b border-line pb-8 text-[36px] font-bold leading-[1.35] tracking-[-0.02em] text-ink min-[720px]:text-[44px]">
            {news.title}
          </h1>
          <p className="mt-4 text-[12px] leading-[1.8] text-muted">
            発信：{authorName}
            {authorRole ? `（${authorRole}）` : ""}
          </p>
          {news.eyecatch && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-cream">
              <Image
                src={news.eyecatch.url}
                alt={news.title}
                fill
                sizes="(min-width: 900px) 860px, 100vw"
                className={isBadgeImage(news.eyecatch.url) ? "object-contain p-10" : "object-cover"}
                priority
              />
            </div>
          )}
          {/* 本文は microCMS 管理画面（社内編集者のみ）由来のリッチテキスト */}
          <div
            className="news-body mt-10"
            dangerouslySetInnerHTML={{ __html: news.body ?? "" }}
          />

          {news.gallery && news.gallery.length > 0 && (
            <div className="mt-12 border-t border-line pt-8">
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                Gallery
              </p>
              <div className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2">
                {news.gallery.map((image, index) => (
                  <div
                    key={`${image.url}-${index}`}
                    className="relative aspect-[4/3] overflow-hidden bg-cream"
                  >
                    <Image
                      src={image.url}
                      alt={`${news.title} 写真 ${index + 1}`}
                      fill
                      sizes="(min-width: 900px) 420px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-line pt-8">
            <Link
              href="/news"
              className="group inline-flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.12em] text-ink transition-colors hover:text-brand"
            >
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-x-1.5"
              >
                ←
              </span>
              ニュース一覧へ戻る
            </Link>
            <a
              href={shareHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.12em] text-ink transition-colors hover:text-brand"
            >
              この記事をXでシェア
              <span aria-hidden className="font-mono text-[11px] text-muted">
                ↗
              </span>
            </a>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                More News
              </p>
              <h2 className="palt mb-6 text-[22px] font-bold tracking-[-0.02em] text-ink">
                その他のニュース
              </h2>
              <div className="border-t border-line">
                {related.map((n) => (
                  <Link
                    key={n.id}
                    href={`/news/${n.id}`}
                    className="grid grid-cols-[auto_auto_1fr] items-center gap-x-4 gap-y-2.5 border-b border-line px-1 py-[18px] transition-colors hover:bg-cream min-[720px]:grid-cols-[120px_104px_1fr_auto] min-[720px]:gap-5"
                  >
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
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
