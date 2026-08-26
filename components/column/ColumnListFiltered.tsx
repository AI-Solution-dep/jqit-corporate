"use client";

import Link from "next/link";
import { useState } from "react";
import { formatColumnDate, type Column } from "@/lib/column";

const ALL = "すべて";
const MAX_TAGS = 8;

type Item = Pick<Column, "id" | "title" | "date" | "excerpt" | "tags">;

/**
 * 技術記事の一覧はタイトル・タグ・要約が読めることを優先し、
 * アイキャッチ画像は持たせない（記事ごとの装飾画像は内容を伝えないため）。
 * 画像がないぶん、枠と余白で1件を「塊」として見せる。ホバーの赤ラインと
 * 背景の変化はサイト共通の .brand-line-card（globals.css）に揃えている。
 */
export function ColumnListFiltered({ items }: { items: Item[] }) {
  const [active, setActive] = useState(ALL);
  // タグは記事ごとに5つ前後付くため、全件出すとタブが何行にもなって一覧が押し下がる。
  // 記事数の多い順に絞り、1本しか付いていないタグは出さない。
  const counts = new Map<string, number>();
  for (const tag of items.flatMap((c) => c.tags)) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  const tags = [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TAGS)
    .map(([tag]) => tag);
  const tabs = [ALL, ...tags];
  const shown = active === ALL ? items : items.filter((c) => c.tags.includes(active));

  return (
    <>
      {tags.length > 0 && (
        // タブではなくタグとして見せる（記事に付いているタグと同じ形）
        <div
          role="group"
          aria-label="タグで絞り込み"
          className="flex flex-wrap gap-2 border-b border-line pb-7"
        >
          {tabs.map((t) => {
            const selected = t === active;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(t)}
                className={`rounded-card border px-3.5 py-1.5 font-mono text-[12px] tracking-[0.06em] transition-colors ${
                  selected
                    ? "border-brand bg-brand font-semibold text-white"
                    : "border-line text-muted hover:border-brand hover:text-brand"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-7 grid grid-cols-1 gap-[18px] min-[900px]:grid-cols-2">
        {shown.map((c) => (
          <Link
            key={c.id}
            href={`/column/${c.id}`}
            className="brand-line-card group flex flex-col rounded-card border border-line px-6 py-7 min-[720px]:px-7"
          >
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <time
                dateTime={c.date}
                className="font-mono text-[12px] tracking-[0.08em] text-muted"
              >
                {formatColumnDate(c.date)}
              </time>
              {c.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-card border border-line px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-muted"
                >
                  {tag}
                </span>
              ))}
            </span>

            <span className="palt mt-3.5 text-[21px] font-bold leading-[1.5] tracking-[-0.02em] text-ink transition-colors group-hover:text-brand min-[720px]:text-[22px]">
              {c.title}
            </span>

            {c.excerpt && (
              <span className="mt-3 text-[14px] leading-[1.95] text-body">
                {c.excerpt}
              </span>
            )}

            <span className="mt-5 inline-flex items-center gap-2 font-mono text-[12px] font-semibold tracking-[0.12em] text-ink transition-colors group-hover:text-brand">
              続きを読む
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="py-16 text-center text-sm text-muted">
          該当するコラムはありません。
        </p>
      )}
    </>
  );
}
