import type { MicroCMSQueries } from "microcms-js-sdk";
import {
  microcmsClient,
  prepareRichTextHtml,
  type MicroCMSImage,
} from "./microcms";

/**
 * 受託開発実績。microCMS 側のAPIスキーマ（エンドポイント: works）:
 * - title: テキスト（実績の見出し。例「基幹システムのクラウド移行とQA自動化」）
 * - date: 日時（並び順の基準。プロジェクト完了月でよい）
 * - clientName: テキスト（社名公開の許諾が取れている場合のみ入力）
 * - clientAlias: テキスト（非公開時の代替表記。例「大手製造業A社」）
 * - industry: セレクト（業種）
 * - serviceType: セレクト（提供サービス）
 * - period: テキスト（例「2025.04 - 2025.12」）
 * - scale: テキスト（例「6名 / 9ヶ月」）
 * - summary: テキストエリア（一覧カードの要約。1〜2文）
 * - challenge / approach / result: リッチエディタ（課題→打ち手→成果）
 * - metrics: 繰り返しフィールド（label + value。例 label「リリース工数」value「-40%」）
 * - techStack: テキスト（カンマ or 読点区切り）
 * - eyecatch: 画像
 * - body: リッチエディタ（補足。任意）
 *
 * 社名公開の運用ルール:
 *   clientName があれば実名、なければ clientAlias、どちらも無ければ業種から自動生成する。
 *   実名は「許諾が取れたものだけ入力する」ことで、うっかり公開を構造的に防ぐ。
 */
export type Work = {
  id: string;
  title: string;
  date: string;
  publishedAt?: string;
  updatedAt?: string;
  /** 表示用の顧客名。実名 or 匿名表記 */
  client: string;
  /** 実名を出してよい案件か（詳細ページの表記を切り替える） */
  clientDisclosed: boolean;
  industry: string;
  serviceType: string;
  period?: string;
  scale?: string;
  summary?: string;
  metrics: WorkMetric[];
  techStack: string[];
  challenge?: string;
  approach?: string;
  result?: string;
  body?: string;
  eyecatch?: MicroCMSImage;
  /** フォールバック（microCMS未接続）由来のサンプルデータか */
  isSample?: boolean;
  /** アイキャッチが構成図か（写真ではないため、切り抜かず全体を見せる） */
  isDiagram?: boolean;
};

export type WorkMetric = {
  label: string;
  value: string;
};

type MicroCMSSelect = string | string[] | { name?: string; id?: string };

type MicroCMSWork = {
  id: string;
  title: string;
  date?: string;
  publishedAt?: string;
  updatedAt?: string;
  clientName?: string;
  clientAlias?: string;
  industry?: MicroCMSSelect;
  serviceType?: MicroCMSSelect;
  period?: string;
  scale?: string;
  summary?: string;
  metrics?: { label?: string; value?: string }[];
  techStack?: string | string[];
  challenge?: string;
  approach?: string;
  result?: string;
  body?: string;
  eyecatch?: MicroCMSImage;
};

/**
 * 実績ごとの構成図。顧客システムの画面は公開できないため、
 * 「何をどう作ったか」を示す図をリポジトリ側に持つ。
 * microCMS 側に eyecatch が入ればそちらが優先される。
 */
const defaultWorkMedia: Record<string, MicroCMSImage> = {
  "school-ijime-ai-support": {
    url: "/works/school-ijime-ai-support.webp",
    width: 1600,
    height: 900,
  },
  "ai-agent-sales-list": {
    url: "/works/ai-agent-sales-list.webp",
    width: 1600,
    height: 900,
  },
};

function isNotFoundError(e: unknown): boolean {
  return e instanceof Error && /\b404\b/.test(e.message);
}

function selectValue(value: MicroCMSSelect | undefined, fallback: string): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  if (typeof value === "object" && value !== null) return value.name ?? fallback;
  return value?.trim() || fallback;
}

/** カンマ・読点・中黒のいずれ区切りでも技術スタックとして解釈する */
function parseTechStack(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.map((v) => v.trim()).filter(Boolean);
  if (!value) return [];
  return value
    .split(/[,、\/]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function normalize(item: MicroCMSWork): Work {
  const industry = selectValue(item.industry, "その他");
  const clientName = item.clientName?.trim();
  const clientAlias = item.clientAlias?.trim();

  return {
    id: item.id,
    title: item.title,
    date: (item.date ?? item.publishedAt)?.slice(0, 10) ?? "",
    publishedAt: item.publishedAt ?? item.date,
    updatedAt: item.updatedAt ?? item.publishedAt ?? item.date,
    client: clientName || clientAlias || `${industry}のお客様`,
    clientDisclosed: Boolean(clientName),
    industry,
    serviceType: selectValue(item.serviceType, "受託開発"),
    period: item.period?.trim() || undefined,
    scale: item.scale?.trim() || undefined,
    summary: item.summary?.trim() || undefined,
    metrics: (item.metrics ?? [])
      .map((m) => ({ label: m.label?.trim() ?? "", value: m.value?.trim() ?? "" }))
      .filter((m) => m.label && m.value),
    techStack: parseTechStack(item.techStack),
    isDiagram: !item.eyecatch && Boolean(defaultWorkMedia[item.id]),
    challenge: prepareRichTextHtml(item.challenge),
    approach: prepareRichTextHtml(item.approach),
    result: prepareRichTextHtml(item.result),
    body: prepareRichTextHtml(item.body),
    eyecatch: item.eyecatch ?? defaultWorkMedia[item.id],
  };
}

async function fallbackWorks(limit?: number): Promise<Work[]> {
  const { fallbackWorks } = await import("./works-fallback");
  return fallbackWorks.slice(0, limit ?? fallbackWorks.length);
}

export async function getWorksList(queries?: MicroCMSQueries): Promise<Work[]> {
  if (!microcmsClient) {
    return fallbackWorks(queries?.limit);
  }
  try {
    const res = await microcmsClient.getList<MicroCMSWork>({
      endpoint: "works",
      queries: { orders: "-date", ...queries },
    });
    const works = res.contents
      .map(normalize)
      .sort((a, b) => b.date.localeCompare(a.date));
    return works.length > 0 ? works : fallbackWorks(queries?.limit);
  } catch (e) {
    // works エンドポイント未作成（404）の間はサンプルで表示を確認できるようにする
    if (!isNotFoundError(e)) {
      console.error("[microcms] 実績一覧の取得に失敗。フォールバックを使用:", e);
    }
    return fallbackWorks(queries?.limit);
  }
}

export async function getWorkDetail(id: string): Promise<Work | null> {
  if (!microcmsClient) {
    const { fallbackWorks } = await import("./works-fallback");
    return fallbackWorks.find((w) => w.id === id) ?? null;
  }
  try {
    const item = await microcmsClient.getListDetail<MicroCMSWork>({
      endpoint: "works",
      contentId: id,
    });
    return normalize(item);
  } catch (e) {
    if (!isNotFoundError(e)) {
      console.error(`[microcms] 実績詳細(${id})の取得に失敗:`, e);
    }
    const { fallbackWorks } = await import("./works-fallback");
    return fallbackWorks.find((w) => w.id === id) ?? null;
  }
}

export function formatWorkDate(date: string): string {
  return date.replaceAll("-", ".");
}
