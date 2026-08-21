"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatColumnDate, type Column } from "@/lib/column";

const ALL = "すべて";
const MAX_TAGS = 8;

type Item = Pick<
  Column,
  "id" | "title" | "date" | "excerpt" | "tags" | "eyecatch" | "authorName"
>;

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
        <div
          role="tablist"
          aria-label="タグで絞り込み"
          className="flex flex-wrap gap-x-8 gap-y-1 border-b border-line"
        >
          {tabs.map((t) => {
            const selected = t === active;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(t)}
                className={`-mb-px border-b-2 pb-3 pt-1 font-mono text-[13px] tracking-[0.1em] transition-colors ${
                  selected
                    ? "border-brand font-semibold text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 min-[720px]:grid-cols-2">
        {shown.map((c) => (
          <Link
            key={c.id}
            href={`/column/${c.id}`}
            className="group flex flex-col border-b border-line pb-8"
          >
            <span className="relative block aspect-[16/10] overflow-hidden bg-cream">
              {c.eyecatch ? (
                <Image
                  src={c.eyecatch.url}
                  alt=""
                  fill
                  sizes="(min-width: 720px) 540px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.24em] text-[#c9c6c0]">
                  JQIT Column
                </span>
              )}
            </span>

            <span className="mt-5 flex flex-wrap items-center gap-2">
              <time
                dateTime={c.date}
                className="font-mono text-[12px] tracking-[0.06em] text-muted"
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

            <span className="palt mt-3 text-[20px] font-bold leading-[1.55] tracking-[-0.02em] text-ink transition-colors group-hover:text-brand">
              {c.title}
            </span>

            {c.excerpt && (
              <span className="mt-3.5 text-[14px] leading-[1.95] text-body">
                {c.excerpt}
              </span>
            )}
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
