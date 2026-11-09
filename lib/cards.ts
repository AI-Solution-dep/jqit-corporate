import { siteConfig } from "#site-config";

export type BusinessCard = {
  slug: string;
  name: string;
  reading: string;
  nameEn: string;
  title: string;
  department: string;
  email: string;
  mobile: string;
  message: string;
  tags: readonly string[];
  /** URLで案内可能かどうか。trueでも検索・ナビには掲載しない。 */
  published: boolean;
};

export const cards: readonly BusinessCard[] = [
  {
    slug: "miyamoto",
    name: "宮本 尚寛",
    reading: "みやもと たかひろ",
    nameEn: "TAKAHIRO MIYAMOTO",
    title: "取締役",
    department: "AIソリューション事業 統括",
    email: "t.miyamoto@jqit.co.jp",
    mobile: "080-4910-6040",
    message: "AIシステムの開発と、既存業務へのAI導入を統括しています。業務のどこにAIを入れると効くのか、小さく試すところからご相談ください。",
    tags: ["AIシステムの開発", "既存業務へのAI導入", "Python・FastAPI", "LLM・RAG"],
    published: true,
  },
];

export function publishedCards(source: readonly BusinessCard[] = cards) {
  return source.filter(card => card.published);
}

export function findCard(slug: string, source: readonly BusinessCard[] = cards) {
  return source.find(card => card.slug === slug && card.published);
}

export function cardUrl(slug: string) {
  return `${siteConfig.url}/card/${encodeURIComponent(slug)}`;
}

export function escapeVCardText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/** 半角・全角空白のどちらも姓名の区切りとして扱う。 */
function splitName(value: string) {
  const [last = "", ...first] = value.trim().split(/[\s\u3000]+/u);
  return [last, first.join(" ")];
}

/** UTF-8の文字境界を保ち、継続行の空白込みで75オクテット以内に折り返す。 */
function foldVCardLine(line: string): string {
  const encoder = new TextEncoder();
  let result = "";
  let bytes = 0;
  for (const character of line) {
    const length = encoder.encode(character).length;
    if (bytes + length > 75) {
      result += "\r\n ";
      bytes = 1;
    }
    result += character;
    bytes += length;
  }
  return result;
}

export function createVCard(card: BusinessCard): string {
  const escape = escapeVCardText;
  const [last, first] = splitName(card.name);
  const [phoneticLast, phoneticFirst] = splitName(card.reading);
  // 会社住所はsiteConfigを正とし、郵便番号のみADRの専用フィールドへ移す。
  const postalCode = siteConfig.address.match(/〒([\d-]+)/)?.[1] ?? "";
  const street = siteConfig.address.replace(/^〒[\d-]+\s*/, "");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(last)};${escape(first)};;;`,
    `FN:${escape(card.name)}`,
    `X-PHONETIC-LAST-NAME:${escape(phoneticLast)}`,
    `X-PHONETIC-FIRST-NAME:${escape(phoneticFirst)}`,
    `ORG:${escape(siteConfig.name)};${escape(card.department)}`,
    `TITLE:${escape(card.title)}`,
    `TEL;TYPE=CELL:${escape(card.mobile)}`,
    `TEL;TYPE=WORK:${escape(siteConfig.tel)}`,
    `EMAIL:${escape(card.email)}`,
    `ADR;TYPE=WORK:;;${escape(street)};;;${escape(postalCode)};日本`,
    `URL:${escape(siteConfig.url)}`,
    "END:VCARD",
  ].map(foldVCardLine).join("\r\n") + "\r\n";
}
