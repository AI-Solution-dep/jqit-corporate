import { getColumnList } from "@/lib/column";
import { buildLlmsTxt } from "@/lib/llms-txt";
import { siteConfig } from "@/lib/site-config";
import { getWorksList } from "@/lib/works";

// sitemap.xml と同じく ISR。記事を公開したら1時間以内に反映する。
// ⚠️ force-static を付けると再デプロイするまで古いままになる。
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
