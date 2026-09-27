// ニュース一覧ソート機能
// date フィールド（"YYYY-MM-DD" 形式）でソート

export const SORT_ORDERS = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;

export type SortOrder = (typeof SORT_ORDERS)[keyof typeof SORT_ORDERS];

// ニュース配列をソート
export function sortNewsByDate<T extends { date: string }>(
  items: T[],
  order: SortOrder,
): T[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    const aTime = parseDate(a.date);
    const bTime = parseDate(b.date);
    if (order === SORT_ORDERS.NEWEST) {
      return bTime - aTime; // 降順（新しい順）
    } else {
      return aTime - bTime; // 昇順（古い順）
    }
  });
  return sorted;
}

// 日付文字列をタイムスタンプに変換（無効な日付は 0 として扱う）
function parseDate(dateStr: string): number {
  if (!dateStr || dateStr.trim() === "") {
    return 0;
  }
  const time = new Date(dateStr).getTime();
  return Number.isNaN(time) ? 0 : time;
}
