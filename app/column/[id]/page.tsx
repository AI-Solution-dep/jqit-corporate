import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import {
  formatColumnDate,
  getColumnDetail,
  getColumnList,
  type Column,
} from "@/lib/column";
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

/** 更新日も日本時間の暦日で比較・表示する（lib/column.ts の date と揃える） */
function formatUpdatedDate(column: Column): string {
  const raw = column.updatedAt;
  if (!raw) return column.date;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(raw));
}

function columnDescription(column: Column): string {
  const source = plainTextFromHtml(column.excerpt ?? column.body);
  const fallback = `${column.title}。株式会社JQITの技術コラムです。`;
  return createDescription(source.length >= 50 ? source : fallback, fallback);
}

function columnAuthor(column: Column) {
  const authorName = column.authorName ?? siteConfig.name;
  const authorRole =
    column.authorRole ?? (authorName === siteConfig.name ? "技術広報" : undefined);
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

/** ビルド時に既知の記事を事前生成（未知IDは通常ビルドではISRで都度生成） */
export async function generateStaticParams() {
  const columns = await getColumnList({ limit: 100 });
  return columns.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const column = await getColumnDetail(id);
  if (!column) return { title: "技術コラム", robots: { index: false, follow: false } };

  return {
    ...createPageMetadata({
      title: column.title,
      description: columnDescription(column),
      path: `/column/${column.id}`,
      type: "article",
      image: column.eyecatch
        ? {
            url: column.eyecatch.url,
            width: column.eyecatch.width,
            height: column.eyecatch.height,
            alt: column.title,
          }
        : undefined,
      publishedTime: column.publishedAt,
      modifiedTime: column.updatedAt,
    }),
    // 公開時にこの robots 指定を削除する（app/column/page.tsx のコメント参照）
    robots: { index: false, follow: false },
  };
}

export default async function ColumnDetailPage({ params }: Props) {
  const { id } = await params;
  const column = await getColumnDetail(id);
  if (!column) notFound();

  const related = (await getColumnList({ limit: 4 }))
    .filter((c) => c.id !== column.id)
    .slice(0, 3);
  const description = columnDescription(column);
  const articleUrl = absoluteUrl(`/column/${column.id}`);
  const { authorName, authorRole, jsonLd: authorJsonLd } = columnAuthor(column);
  const publishedDate = column.date;
  const modifiedDate = formatUpdatedDate(column);
  const shareHref = `https://x.com/intent/post?text=${encodeURIComponent(
    `${column.title}｜${siteConfig.name}`,
  )}&url=${encodeURIComponent(articleUrl)}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        mainEntityOfPage: articleUrl,
        headline: column.title,
        description,
        image: column.eyecatch ? [absoluteUrl(column.eyecatch.url)] : undefined,
        datePublished: column.publishedAt,
        dateModified: column.updatedAt,
        inLanguage: "ja-JP",
        keywords: column.tags.length > 0 ? column.tags.join(", ") : undefined,
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
        { name: "技術コラム", path: "/column" },
        { name: column.title, path: `/column/${column.id}` },
      ]),
    ],
  } satisfies Record<string, unknown>;

  return (
    <>
      <JsonLd data={articleJsonLd} />
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
            <Link href="/column" className="transition-colors hover:text-brand">
              COLUMN
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span
              aria-current="page"
              className="inline-block max-w-[24em] truncate align-bottom font-sans tracking-normal"
            >
              {column.title}
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
              公開 {formatColumnDate(publishedDate)}
            </time>
            {modifiedDate > publishedDate && (
              <time
                dateTime={modifiedDate}
                className="font-mono text-[13px] tracking-[0.06em] text-muted"
              >
                更新 {formatColumnDate(modifiedDate)}
              </time>
            )}
            {column.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-card border border-line px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="palt border-b border-line pb-8 text-[36px] font-bold leading-[1.35] tracking-[-0.02em] text-ink min-[720px]:text-[44px]">
            {column.title}
          </h1>

          <p className="mt-4 text-[12px] leading-[1.8] text-muted">
            執筆：{authorName}
            {authorRole ? `（${authorRole}）` : ""}
          </p>

          {column.excerpt && (
            <p className="mt-6 text-[16px] leading-[2.05] text-body">{column.excerpt}</p>
          )}

          {column.eyecatch && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-cream">
              <Image
                src={column.eyecatch.url}
                alt={column.title}
                fill
                sizes="(min-width: 900px) 860px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* 本文は microCMS 管理画面（社内編集者のみ）由来のリッチテキスト */}
          <div
            className="news-body mt-10"
            dangerouslySetInnerHTML={{ __html: column.body ?? "" }}
          />

          {column.qiitaUrl && (
            <p className="mt-12 border-l-2 border-brand bg-cream px-5 py-4 text-[13px] leading-[1.9] text-body">
              この記事は{" "}
              <a
                href={column.qiitaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand underline underline-offset-4 transition-colors hover:text-ink"
              >
                Qiita
              </a>{" "}
              でも公開しています。
            </p>
          )}

          <div className="mt-16 border border-line bg-cream px-8 py-10 text-center">
            <p className="palt text-[20px] font-bold leading-[1.6] tracking-[-0.02em] text-ink">
              同じような課題をお持ちですか。
            </p>
            <p className="mt-3 text-[14px] leading-[1.95] text-body">
              現状の整理からご相談いただけます。まずはお気軽にお問い合わせください。
            </p>
            <div className="mt-7 flex justify-center">
              <Button href="/contact">お問い合わせ</Button>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-line pt-8">
            <Link
              href="/column"
              className="group inline-flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.12em] text-ink transition-colors hover:text-brand"
            >
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-x-1.5"
              >
                ←
              </span>
              コラム一覧へ戻る
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
              <Kicker className="mb-3">More Column</Kicker>
              <h2 className="palt mb-6 text-[22px] font-bold tracking-[-0.02em] text-ink">
                その他のコラム
              </h2>
              <div className="border-t border-line">
                {related.map((c) => (
                  <Link
                    key={c.id}
                    href={`/column/${c.id}`}
                    className="flex flex-col gap-2 border-b border-line px-1 py-[18px] transition-colors hover:bg-cream min-[720px]:flex-row min-[720px]:items-center min-[720px]:gap-5"
                  >
                    <span className="w-[110px] shrink-0 font-mono text-[13px] tracking-[0.06em] text-muted">
                      {formatColumnDate(c.date)}
                    </span>
                    <span className="flex-1 text-[15px] leading-[1.7] text-ink">
                      {c.title}
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
