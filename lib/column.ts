import type { MicroCMSQueries } from "microcms-js-sdk";
import {
  microcmsClient,
  prepareRichTextHtml,
  type MicroCMSImage,
} from "./microcms";

/**
 * 技術コラム。microCMS 側のAPIスキーマ（エンドポイント: column）:
 * - title: テキスト（記事タイトル）
 * - date: 日時（並び順の基準。公開日）
 * - tags: テキスト（カンマ・読点区切り。例「Playwright, テスト自動化」）
 * - excerpt: テキストエリア（一覧カードの要約。1〜2文）
 * - authorName / authorRole: テキスト（署名。未入力なら社名名義）
 * - eyecatch: 画像（一覧カード・OGP兼用）
 * - body: リッチエディタ（本文）
 * - qiitaUrl: テキスト（Qiita 転載先URL。入力すると記事末尾に相互リンクを出す）
 *
 * 運用ルール:
 *   HP に先に公開してインデックス登録し、そのあと Qiita へ転載する。
 *   転載したら qiitaUrl を埋めて相互リンクを張る。
 */
export type Column = {
  id: string;
  title: string;
  date: string;
  publishedAt?: string;
  updatedAt?: string;
  excerpt?: string;
  authorName?: string;
  authorRole?: string;
  tags: string[];
  eyecatch?: MicroCMSImage;
  body?: string;
  /** Qiita 転載先。https のURLのみ通す */
  qiitaUrl?: string;
};

type MicroCMSColumn = {
  id: string;
  title: string;
  date?: string;
  publishedAt?: string;
  updatedAt?: string;
  excerpt?: string;
  authorName?: string;
  authorRole?: string;
  tags?: string | string[];
  eyecatch?: MicroCMSImage;
  body?: string;
  content?: string;
  qiitaUrl?: string;
};

function isNotFoundError(e: unknown): boolean {
  return e instanceof Error && /\b404\b/.test(e.message);
}

/** カンマ・読点・スラッシュのいずれ区切りでもタグとして解釈する */
function parseTags(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.map((v) => v.trim()).filter(Boolean);
  if (!value) return [];
  return value
    .split(/[,、\/]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * CMS 由来のURLをそのまま href にしないための検証。
 * javascript: 等のスキームを弾き、https のみ通す（CMSアカウント侵害時の多層防御）。
 */
function safeHttpsUrl(value: string | undefined): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * 日時フィールドは UTC の ISO 文字列で返るため、先頭10文字を切ると
 * 日本時間の朝までに書かれた記事が前日扱いになる。日本時間の暦日に直す。
 */
function toJstDate(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function normalize(item: MicroCMSColumn): Column {
  return {
    id: item.id,
    title: item.title,
    date: toJstDate(item.date ?? item.publishedAt),
    publishedAt: item.publishedAt ?? item.date,
    updatedAt: item.updatedAt ?? item.publishedAt ?? item.date,
    excerpt: item.excerpt?.trim() || undefined,
    authorName: item.authorName?.trim() || undefined,
    authorRole: item.authorRole?.trim() || undefined,
    tags: parseTags(item.tags),
    eyecatch: item.eyecatch,
    body: prepareRichTextHtml(item.body ?? item.content),
    qiitaUrl: safeHttpsUrl(item.qiitaUrl),
  };
}

export async function getColumnList(queries?: MicroCMSQueries): Promise<Column[]> {
  if (!microcmsClient) return [];
  try {
    const res = await microcmsClient.getList<MicroCMSColumn>({
      endpoint: "column",
      queries: { orders: "-date", ...queries },
    });
    return res.contents
      .map(normalize)
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch (e) {
    // column エンドポイント未作成（404）の間は空一覧で表示を保つ
    if (!isNotFoundError(e)) {
      console.error("[microcms] コラム一覧の取得に失敗:", e);
    }
    return [];
  }
}

export async function getColumnDetail(id: string): Promise<Column | null> {
  if (!microcmsClient) return null;
  try {
    const item = await microcmsClient.getListDetail<MicroCMSColumn>({
      endpoint: "column",
      contentId: id,
    });
    return normalize(item);
  } catch (e) {
    // 404（未公開・削除済み・エンドポイント未作成）は正常系なのでログしない
    if (!isNotFoundError(e)) {
      console.error(`[microcms] コラム詳細(${id})の取得に失敗:`, e);
    }
    return null;
  }
}

export function formatColumnDate(date: string): string {
  return date.replaceAll("-", ".");
}
