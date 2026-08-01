import { PageHeader } from "@/components/layout/PageHeader";
import { NewsListFiltered } from "@/components/news/NewsListFiltered";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { getNewsList } from "@/lib/microcms";
import { createPageMetadata, createWebPageJsonLd } from "@/lib/seo";

const pageDescription =
  "株式会社JQITのニュース一覧。IT・AIソリューション、認定・許可、社内イベントなど、当社の最新情報をお届けします。";

export const metadata = createPageMetadata({
  title: "ニュース",
  description: pageDescription,
  path: "/news",
});

const newsPageJsonLd = createWebPageJsonLd({
  type: "CollectionPage",
  name: "ニュース｜株式会社JQIT",
  description: pageDescription,
  path: "/news",
  breadcrumbs: [
    { name: "ホーム", path: "/" },
    { name: "ニュース", path: "/news" },
  ],
});

export const revalidate = 60;

export default async function NewsListPage() {
  const news = await getNewsList({ limit: 50 });

  return (
    <>
      <JsonLd data={newsPageJsonLd} />
      <PageHeader title="ニュース" en="News" />
      <section className="bg-paper pb-16 pt-14 min-[720px]:pb-20 min-[720px]:pt-16">
        <Container>
          <FadeIn>
            <NewsListFiltered items={news} />
          </FadeIn>
          {news.length === 0 && (
            <p className="py-16 text-center text-sm text-muted">
              現在、公開中のニュースはありません。
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
