import { getColumnList } from "@/lib/column";
import { buildLlmsTxt } from "@/lib/llms-txt";
import { siteConfig } from "@/lib/site-config";
import { getWorksList } from "@/lib/works";

// sitemap.xml と同じく静的生成し、記事を公開したら1時間以内に反映する
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const [columns, works] = await Promise.all([
    getColumnList({ limit: 100 }),
    getWorksList({ limit: 100 }),
  ]);

  return new Response(buildLlmsTxt({ site: siteConfig, columns, works }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
