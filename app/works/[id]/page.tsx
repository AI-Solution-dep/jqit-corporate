import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { resolveBusinessLinkByServiceType } from "@/lib/business-links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  createDescription,
  createPageMetadata,
  plainTextFromHtml,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getWorkDetail, getWorksList, type Work } from "@/lib/works";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

function workDescription(work: Work): string {
  const source = plainTextFromHtml(work.summary ?? work.challenge);
  const fallback = `${work.client}の${work.title}。株式会社JQITが手がけた${work.serviceType}の事例をご紹介します。`;
  return createDescription(source.length >= 50 ? source : fallback, fallback);
}

/** ビルド時に既知の実績を事前生成（未知IDは通常ビルドではISRで都度生成） */
export async function generateStaticParams() {
  const works = await getWorksList({ limit: 100 });
  return works.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const work = await getWorkDetail(id);
  if (!work) return { title: "実績", robots: { index: false, follow: false } };

  return {
    ...createPageMetadata({
      title: work.title,
      description: workDescription(work),
      path: `/works/${work.id}`,
      type: "article",
      image: work.eyecatch
        ? {
            url: work.eyecatch.url,
            width: work.eyecatch.width,
            height: work.eyecatch.height,
            alt: work.title,
          }
        : undefined,
      publishedTime: work.publishedAt,
      modifiedTime: work.updatedAt,
    }),
  };
}

function Section({
  kicker,
  title,
  html,
}: {
  kicker: string;
  title: string;
  html?: string;
}) {
  if (!html) return null;
  return (
    <div className="mt-14 first:mt-0">
      <Kicker className="mb-3">{kicker}</Kicker>
      <h2 className="palt text-[24px] font-bold leading-[1.45] tracking-[-0.02em] text-ink min-[720px]:text-[28px]">
        {title}
      </h2>
      {/* 本文は microCMS 管理画面（社内編集者のみ）由来のリッチテキスト */}
      <div className="news-body mt-5" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;
  const work = await getWorkDetail(id);
  if (!work) notFound();

  const businessLink = resolveBusinessLinkByServiceType(work.serviceType);

  const related = (await getWorksList({ limit: 4 }))
    .filter((w) => w.id !== work.id)
    .slice(0, 2);
  const description = workDescription(work);
  const articleUrl = absoluteUrl(`/works/${work.id}`);
  const facts = [
    { label: "お客様", value: work.client },
    { label: "業種", value: work.industry },
    { label: "提供サービス", value: work.serviceType },
    ...(work.period ? [{ label: "期間", value: work.period }] : []),
    ...(work.scale ? [{ label: "体制", value: work.scale }] : []),
  ];
  const caseJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        mainEntityOfPage: articleUrl,
        headline: work.title,
        description,
        image: work.eyecatch ? [absoluteUrl(work.eyecatch.url)] : undefined,
        datePublished: work.publishedAt,
        dateModified: work.updatedAt,
        inLanguage: "ja-JP",
        author: {
          "@type": "Organization",
          "@id": `${siteConfig.url}/#organization`,
          name: siteConfig.name,
        },
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      createBreadcrumbJsonLd([
        { name: "ホーム", path: "/" },
        { name: "実績", path: "/works" },
        { name: work.title, path: `/works/${work.id}` },
      ]),
    ],
  } satisfies Record<string, unknown>;

  return (
    <>
      <JsonLd data={caseJsonLd} />
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
            <Link href="/works" className="transition-colors hover:text-brand">
              WORKS
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span
              aria-current="page"
              className="inline-block max-w-[24em] truncate align-bottom font-sans tracking-normal"
            >
              {work.title}
            </span>
          </nav>
        </Container>
      </div>

      <section className="bg-paper pb-24 pt-12 min-[720px]:pt-14">
        <Container className="max-w-[860px]">
          {work.isSample && (
            <p className="mb-8 border-l-2 border-brand bg-cream px-5 py-4 text-[13px] leading-[1.9] text-body">
              <strong className="font-bold text-ink">
                表示確認用のサンプルです。
              </strong>
              実在の案件ではありません。
            </p>
          )}

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-card border border-brand px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-brand">
              {work.serviceType}
            </span>
            <span className="rounded-card border border-line px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-muted">
              {work.industry}
            </span>
          </div>

          <h1 className="palt text-[32px] font-bold leading-[1.4] tracking-[-0.02em] text-ink min-[720px]:text-[42px]">
            {work.title}
          </h1>

          {work.summary && (
            <p className="mt-6 text-[16px] leading-[2.05] text-body">{work.summary}</p>
          )}

          {work.eyecatch && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-cream">
              <Image
                src={work.eyecatch.url}
                alt={work.title}
                fill
                sizes="(min-width: 900px) 860px, 100vw"
                className={work.isDiagram ? "object-contain" : "object-cover"}
                priority
              />
            </div>
          )}

          <dl className="mt-10 grid grid-cols-1 gap-x-10 border-y border-line py-7 min-[560px]:grid-cols-2">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex gap-4 py-2 text-[14px] leading-[1.9]"
              >
                <dt className="w-[6.5em] shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {fact.label}
                </dt>
                <dd className="text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {work.metrics.length > 0 && (
            <div className="mt-12 grid grid-cols-1 gap-6 min-[560px]:grid-cols-3">
              {work.metrics.map((m) => (
                <div key={m.label} className="border-t-2 border-brand pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {m.label}
                  </p>
                  <p className="palt mt-2 font-mono text-[30px] font-bold leading-none tracking-[-0.02em] text-brand">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16">
            <Section kicker="Challenge" title="課題" html={work.challenge} />
            <Section kicker="Approach" title="打ち手" html={work.approach} />
            <Section kicker="Result" title="成果" html={work.result} />
            <Section kicker="Detail" title="補足" html={work.body} />
          </div>

          {work.techStack.length > 0 && (
            <div className="mt-14 border-t border-line pt-8">
              <Kicker className="mb-4">Tech Stack</Kicker>
              <ul className="flex flex-wrap gap-2">
                {work.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-card border border-line px-3 py-[5px] font-mono text-[12px] tracking-[0.04em] text-body"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {businessLink && (
            <div className="mt-14 border-t border-line pt-8">
              <p className="text-[14px] leading-[1.95] text-body">{businessLink.lead}</p>
              <Link
                href={businessLink.href}
                className="mt-4 inline-flex items-center gap-2 font-mono text-[13px] font-semibold tracking-[0.08em] text-brand transition-colors hover:text-ink"
              >
                {businessLink.label}
                <span aria-hidden>→</span>
              </Link>
            </div>
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

          <div className="mt-14 border-t border-line pt-8">
            <Link
              href="/works"
              className="group inline-flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.12em] text-ink transition-colors hover:text-brand"
            >
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-x-1.5"
              >
                ←
              </span>
              実績一覧へ戻る
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <Kicker className="mb-3">More Works</Kicker>
              <h2 className="palt mb-6 text-[22px] font-bold tracking-[-0.02em] text-ink">
                その他の実績
              </h2>
              <div className="border-t border-line">
                {related.map((w) => (
                  <Link
                    key={w.id}
                    href={`/works/${w.id}`}
                    className="flex flex-col gap-2 border-b border-line px-1 py-[18px] transition-colors hover:bg-cream min-[720px]:flex-row min-[720px]:items-center min-[720px]:gap-5"
                  >
                    <span className="w-[130px] shrink-0 justify-self-start rounded-card border border-brand px-2.5 py-[3px] text-center text-[11px] font-semibold tracking-[0.06em] text-brand">
                      {w.serviceType}
                    </span>
                    <span className="flex-1 text-[15px] leading-[1.7] text-ink">
                      {w.title}
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
