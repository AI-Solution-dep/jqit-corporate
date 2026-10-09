import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sortNewsByDate, SORT_ORDERS } from "../lib/news-sort.ts";

describe("NEWS-SORT: ニュース一覧ソート機能", () => {
  // モックニュースデータ
  const mockNews = [
    { id: "1", title: "最新ニュース", date: "2024-01-15", category: "お知らせ" },
    { id: "2", title: "過去のニュース", date: "2024-01-10", category: "お知らせ" },
    { id: "3", title: "古いニュース", date: "2024-01-05", category: "更新情報" },
  ];

  describe("NEWS-SORT-001: sortNewsByDate - 新着順にソート", () => {
    it("複数ニュースを新着順（降順）でソート", () => {
      const sorted = sortNewsByDate(mockNews, SORT_ORDERS.NEWEST);
      assert.strictEqual(sorted[0].id, "1", "最初は最新（2024-01-15）");
      assert.strictEqual(sorted[1].id, "2", "次は中間（2024-01-10）");
      assert.strictEqual(sorted[2].id, "3", "最後は最古（2024-01-05）");
    });
  });

  describe("NEWS-SORT-002: sortNewsByDate - 古い順にソート", () => {
    it("複数ニュースを古い順（昇順）でソート", () => {
      const sorted = sortNewsByDate(mockNews, SORT_ORDERS.OLDEST);
      assert.strictEqual(sorted[0].id, "3", "最初は最古（2024-01-05）");
      assert.strictEqual(sorted[1].id, "2", "次は中間（2024-01-10）");
      assert.strictEqual(sorted[2].id, "1", "最後は最新（2024-01-15）");
    });
  });

  describe("NEWS-SORT-003: sortNewsByDate - 空配列の場合", () => {
    it("空配列を渡すと空配列を返す", () => {
      const sorted = sortNewsByDate([], SORT_ORDERS.NEWEST);
      assert.deepStrictEqual(sorted, []);
    });
  });

  describe("NEWS-SORT-004: sortNewsByDate - 1件の場合", () => {
    it("1件のニュースは順序変更なし", () => {
      const single = [mockNews[0]];
      const sorted = sortNewsByDate(single, SORT_ORDERS.NEWEST);
      assert.strictEqual(sorted.length, 1);
      assert.strictEqual(sorted[0].id, "1");
    });
  });

  describe("NEWS-SORT-005: sortNewsByDate - 同じ日付の場合の安定性", () => {
    it("同じ日付なら元の順序を保持（安定ソート）", () => {
      const sameDate = [
        { id: "a", title: "タイトルA", date: "2024-01-15", category: "お知らせ" },
        { id: "b", title: "タイトルB", date: "2024-01-15", category: "お知らせ" },
        { id: "c", title: "タイトルC", date: "2024-01-15", category: "お知らせ" },
      ];
      const sorted = sortNewsByDate(sameDate, SORT_ORDERS.NEWEST);
      assert.deepStrictEqual(sorted, sameDate, "元の順序を保持");
    });
  });

  describe("NEWS-SORT-005b: sortNewsByDate - 無効な日付の場合", () => {
    it("空の日付文字列があってもソート可能（NaN 回避）", () => {
      const mixedDates = [
        { id: "1", title: "有効日付", date: "2024-01-15", category: "お知らせ" },
        { id: "2", title: "空日付", date: "", category: "お知らせ" },
        { id: "3", title: "別の有効日付", date: "2024-01-10", category: "お知らせ" },
      ];
      const sorted = sortNewsByDate(mixedDates, SORT_ORDERS.NEWEST);
      // ソート完了 without NaN エラー
      assert.strictEqual(sorted.length, 3, "全要素を返す");
      // 有効な日付の順序は正しい（空日付は最後）
      assert.strictEqual(sorted[0].id, "1", "最初は最新の有効日付");
    });

    it("不正な日付形式があってもソート可能", () => {
      const invalidDates = [
        { id: "1", title: "有効", date: "2024-01-15", category: "お知らせ" },
        { id: "2", title: "不正", date: "invalid-date", category: "お知らせ" },
      ];
      const sorted = sortNewsByDate(invalidDates, SORT_ORDERS.NEWEST);
      assert.strictEqual(sorted.length, 2, "全要素を返す");
    });
  });

  describe("NEWS-SORT-006: 定数チェック - SORT_ORDERS の定義", () => {
    it("SORT_ORDERS が NEWEST と OLDEST を含む", () => {
      assert.ok("NEWEST" in SORT_ORDERS);
      assert.ok("OLDEST" in SORT_ORDERS);
      assert.strictEqual(Object.keys(SORT_ORDERS).length, 2);
    });
  });
});
