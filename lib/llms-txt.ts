import type { Column } from "./column";
import type { Work } from "./works";

/**
 * /llms.txt の本文を組み立てる（形式: https://llmstxt.org/ ）。
 * AI検索・回答エンジンが、会社の概要と主要ページを1回の取得で把握できるようにする。
 *
 * 記事の載せ方は canonical の方針に合わせる:
 * - qiitaUrl がある技術コラムは Qiita が原本（canonical も Qiita）なので載せない
 * - microCMS 未接続時のサンプル実績は実在しないので載せない
 */

type SiteInfo = {
  name: string;
  nameEn: string;
  description: string;
  url: string;
  tel: string;
  address: string;
  businessHours: string;
  foundedDate: string;
  ceo: string;
  employees: string;
  certifications: readonly string[];
  links: {
    recruit: string;
    nova: string;
    aiSupport: string;
    qiita: string;
    note: string;
  };
};

type LlmsTxtInput = {
  site: SiteInfo;
  columns: Column[];
  works: Work[];
};

/** 改行を含む要約でリスト1項目が崩れないよう、1行に畳む */
function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function link(label: string, url: string, note?: string): string {
  const detail = note ? oneLine(note) : "";
  return `- [${oneLine(label)}](${url})${detail ? `: ${detail}` : ""}`;
}

/** "2024-12-06" → "2024年12月6日" */
function formatJapaneseDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export function buildLlmsTxt({ site, columns, works }: LlmsTxtInput): string {
  const page = (path: string) => `${site.url}${path}`;
  const ownColumns = columns.filter((c) => !c.qiitaUrl);
  const realWorks = works.filter((w) => !w.isSample);

  const lines = [
    `# ${site.name}（${site.nameEn}）`,
    "",
    `> ${oneLine(site.description)}`,
    "",
    `- 所在地: ${site.address}`,
    `- 設立: ${formatJapaneseDate(site.foundedDate)}`,
    `- 代表: ${site.ceo}`,
    `- 従業員数: ${site.employees}`,
    `- 認証・許認可: ${site.certifications.join("、")}`,
    `- お問い合わせ: ${page("/contact")}（電話 ${site.tel}、${site.businessHours}）`,
    "",
    "## 事業",
    "",
    link(
      "ITソリューション事業（SES・受託開発・QA）",
      page("/business/it-solutions"),
      "法人向けに、SESでのエンジニア常駐・準委任、業務システムの受託開発、インフラ構築、QA（第三者検証）を提供",
    ),
    link(
      "AIソリューション事業（AIエージェント開発・RAG構築・AI導入支援）",
      page("/business/ai-solutions"),
      "AIエージェント・RAG・チャットボットの受託開発と、AI導入支援・内製化支援を法人向けに提供",
    ),
    link("NOVA", site.links.nova, "自社で開発・運用するAIプロダクトの製品サイト"),
    link("AI導入伴走支援", site.links.aiSupport, "AI導入伴走支援のサービスサイト"),
    "",
    "## 会社情報",
    "",
    link("会社情報", page("/about"), "会社概要・代表メッセージ・アクセス"),
    link("ビジョンと戦略", page("/corporate-vision")),
    link("情報セキュリティ基本方針", page("/security-policy")),
    link(
      "お問い合わせ",
      page("/contact"),
      "IT・AIソリューション、採用、協業のご相談。担当者より2〜3営業日以内に連絡",
    ),
    "",
    "## 実績",
    "",
    link("実績一覧", page("/works"), "受託開発の実績を、課題・打ち手・成果の三点で紹介"),
    ...realWorks.map((w) => link(w.title, page(`/works/${w.id}`), w.summary)),
    "",
    "## 技術コラム",
    "",
    link("技術コラム一覧", page("/column"), "AI導入・テスト自動化・受託開発の現場で得た知見"),
    ...ownColumns.map((c) => link(c.title, page(`/column/${c.id}`), c.excerpt)),
    "",
    "## Optional",
    "",
    link("ニュース", page("/news")),
    link("採用情報", site.links.recruit),
    link("Qiita（技術記事）", site.links.qiita),
    link("note", site.links.note),
    link("プライバシーポリシー", page("/privacy-policy")),
  ];

  return `${lines.join("\n")}\n`;
}
