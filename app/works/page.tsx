import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { WorksListFiltered } from "@/components/works/WorksListFiltered";
import { createPageMetadata, createWebPageJsonLd } from "@/lib/seo";
import { getWorksList } from "@/lib/works";

const pageDescription =
  "株式会社JQITの受託開発実績。課題・打ち手・成果の三点で、これまでに手がけたプロジェクトをご紹介します。";

/**
 * 公開前ページ。ヘッダー・フッター・サイトマップには意図的に載せていない。
 * 公開時にやること:
 *   1. 下の robots 指定を削除
 *   2. lib/site-config.ts の globalNav / footerNav に追加
 *   3. app/sitemap.ts に /works と各実績を追加
 */
export const metadata = {
  ...createPageMetadata({
    title: "実績",
    description: pageDescription,
    path: "/works",
  }),
  robots: { index: false, follow: false },
};

const worksPageJsonLd = createWebPageJsonLd({
  type: "CollectionPage",
  name: "実績｜株式会社JQIT",
  description: pageDescription,
  path: "/works",
  breadcrumbs: [
    { name: "ホーム", path: "/" },
    { name: "実績", path: "/works" },
  ],
});

export const revalidate = 60;

export default async function WorksListPage() {
  const works = await getWorksList({ limit: 50 });
  const hasSample = works.some((w) => w.isSample);

  return (
    <>
      <JsonLd data={worksPageJsonLd} />
      <PageHeader title="実績" en="Works" />
      <section className="bg-paper pb-16 pt-14 min-[720px]:pb-20 min-[720px]:pt-16">
        <Container>
          {hasSample && (
            <p className="mb-10 border-l-2 border-brand bg-cream px-5 py-4 text-[13px] leading-[1.9] text-body">
              <strong className="font-bold text-ink">表示確認用のサンプルです。</strong>
              microCMS に <code className="font-mono text-[12px]">works</code>{" "}
              エンドポイントを作成し、実績を1件登録すると実データに切り替わります。
            </p>
          )}
          <FadeIn>
            <WorksListFiltered items={works} />
          </FadeIn>
          {works.length === 0 && (
            <p className="py-16 text-center text-sm text-muted">
              現在、公開中の実績はありません。
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
