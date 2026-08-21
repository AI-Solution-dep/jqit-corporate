import { ColumnListFiltered } from "@/components/column/ColumnListFiltered";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { getColumnList } from "@/lib/column";
import { createPageMetadata, createWebPageJsonLd } from "@/lib/seo";

const pageDescription =
  "株式会社JQITの技術コラム。AI導入・テスト自動化・受託開発の現場で得た知見を、取り組みの背景から成果まで公開しています。";

export const metadata = createPageMetadata({
  title: "技術コラム",
  description: pageDescription,
  path: "/column",
});

const columnPageJsonLd = createWebPageJsonLd({
  type: "CollectionPage",
  name: "技術コラム｜株式会社JQIT",
  description: pageDescription,
  path: "/column",
  breadcrumbs: [
    { name: "ホーム", path: "/" },
    { name: "技術コラム", path: "/column" },
  ],
});

export const revalidate = 60;

export default async function ColumnListPage() {
  const columns = await getColumnList({ limit: 50 });

  return (
    <>
      <JsonLd data={columnPageJsonLd} />
      <PageHeader title="技術コラム" en="Column" />
      <section className="bg-paper pb-16 pt-14 min-[720px]:pb-20 min-[720px]:pt-16">
        <Container>
          {columns.length > 0 ? (
            <FadeIn>
              <ColumnListFiltered items={columns} />
            </FadeIn>
          ) : (
            <p className="py-16 text-center text-sm text-muted">
              現在、公開中のコラムはありません。
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
