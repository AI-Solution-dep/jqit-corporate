// 限定案内の名刺と同じ公開判定を使う。検索・サイトマップへの掲載はしない。
import { createVCard, findCard, publishedCards } from "@/lib/cards";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedCards().map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = findCard(slug);
  if (!card) return new Response("Not Found", { status: 404 });
  return new Response(createVCard(card), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `inline; filename="${encodeURIComponent(card.slug)}.vcf"`,
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
