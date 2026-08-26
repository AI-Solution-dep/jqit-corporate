/**
 * 記事・実績から事業ページへの内部リンクを、タグやサービス種別から解決する。
 *
 * コラムは microCMS 側でタグを自由に付けられるため、事業ページ側のアンカーと
 * 対応づけるルールをここに集約する。ターゲットキーワードを含むアンカーテキスト
 * にすることで、事業ページへの内部リンクを補強する意図がある。
 */

export type BusinessLink = {
  href: string;
  /** アンカーテキスト。事業ページのターゲットKWを含める */
  label: string;
  /** リンクの前に置く一文 */
  lead: string;
};

const AI_AGENT: BusinessLink = {
  href: "/business/ai-solutions#ai-agent",
  label: "AIエージェント開発・RAG構築の支援内容を見る",
  lead: "この記事のような仕組みを、業務に合わせて設計・開発しています。",
};

const AI_CONSULTING: BusinessLink = {
  href: "/business/ai-solutions#ai-consulting",
  label: "生成AIの導入支援・内製化支援について見る",
  lead: "生成AIを実務で使える形にするまでを、伴走して支援しています。",
};

const QA_DEVELOPMENT: BusinessLink = {
  href: "/business/it-solutions#contract-development",
  label: "受託開発・QA（第三者検証）の進め方を見る",
  lead: "開発品質の作り込みは、受託開発とQAの実務で積み上げた知見にもとづいています。",
};

/**
 * 上から順に評価し、最初にタグが一致したものを採用する。
 * 記事の主題に近いものほど上に置く（汎用タグの「AI」「生成AI」は最後）。
 */
const RULES: { tags: readonly string[]; link: BusinessLink }[] = [
  { tags: ["TDD", "コードレビュー", "Playwright", "開発自動化"], link: QA_DEVELOPMENT },
  {
    tags: ["AIエージェント", "マルチエージェント", "MCP", "RAG"],
    link: AI_AGENT,
  },
  {
    tags: ["機械学習", "ファインチューニング", "LLM", "ローカルLLM"],
    link: AI_AGENT,
  },
  {
    tags: ["自動化", "生産性向上", "ClaudeCode", "codex", "生成AI", "AI"],
    link: AI_CONSULTING,
  },
];

/** タグ配列から、もっとも関連の強い事業ページリンクを1件返す */
export function resolveBusinessLink(tags: readonly string[]): BusinessLink | undefined {
  const normalized = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (normalized.length === 0) return undefined;

  for (const rule of RULES) {
    const hit = rule.tags.some((t) => normalized.includes(t.toLowerCase()));
    if (hit) return rule.link;
  }
  return undefined;
}

/** 実績の serviceType から事業ページリンクを解決する */
export function resolveBusinessLinkByServiceType(
  serviceType: string | undefined,
): BusinessLink | undefined {
  if (!serviceType) return undefined;
  if (serviceType.includes("AIエージェント") || serviceType.includes("AI")) return AI_AGENT;
  if (serviceType.includes("受託開発") || serviceType.includes("QA")) return QA_DEVELOPMENT;
  return undefined;
}
