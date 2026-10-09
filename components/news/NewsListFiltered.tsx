"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { MicroCMSImage } from "@/lib/microcms";
import { sortNewsByDate, SORT_ORDERS, type SortOrder } from "@/lib/news-sort";

type Item = {
  id: string;
  title: string;
  date: string;
  category: string;
  eyecatch?: MicroCMSImage;
};

const ALL = "すべて";

function isBadgeImage(src: string): boolean {
  return src.startsWith("/badges/");
}

export function NewsListFiltered({ items }: { items: Item[] }) {
  const [active, setActive] = useState(ALL);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SORT_ORDERS.NEWEST);

  const categories = Array.from(
    new Set(items.map((n) => n.category).filter((category) => category.trim() !== "")),
  );
  const tabs = [ALL, ...categories];

  // フィルタ後のアイテムをソート
  const filtered = active === ALL ? items : items.filter((n) => n.category === active);
  const shown = sortNewsByDate(filtered, sortOrder);

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
  };

  return (
    <>
      {/* カテゴリフィルタ + ソート操作 */}
      <div className="flex flex-col justify-between gap-4 border-b border-line min-[720px]:flex-row min-[720px]:items-center">
        <div
          role="tablist"
          aria-label="カテゴリで絞り込み"
          className="flex flex-wrap gap-x-8 gap-y-1"
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

        {/* ソートボタン */}
        <div className="flex gap-2" aria-label="ニュース並べ替え">
          <button
            type="button"
            onClick={() => handleSortChange(SORT_ORDERS.NEWEST)}
            className={`rounded border px-3 py-1.5 text-xs font-semibold tracking-[0.06em] transition-colors ${
              sortOrder === SORT_ORDERS.NEWEST
                ? "border-brand bg-brand text-white"
                : "border-line bg-white text-ink hover:border-brand"
            }`}
          >
            新着順
          </button>
          <button
            type="button"
            onClick={() => handleSortChange(SORT_ORDERS.OLDEST)}
            className={`rounded border px-3 py-1.5 text-xs font-semibold tracking-[0.06em] transition-colors ${
              sortOrder === SORT_ORDERS.OLDEST
                ? "border-brand bg-brand text-white"
                : "border-line bg-white text-ink hover:border-brand"
            }`}
          >
            古い順
          </button>
        </div>
      </div>
      <div>
        {shown.map((n) => (
          <Link
            key={n.id}
            href={`/news/${n.id}`}
            className="group grid grid-cols-[auto_auto_1fr] items-center gap-x-4 gap-y-3 border-b border-line px-1 py-[18px] transition-colors hover:bg-cream min-[720px]:grid-cols-[96px_130px_110px_1fr_auto] min-[720px]:gap-6 min-[720px]:py-[22px]"
          >
            {n.eyecatch ? (
              <span className="relative col-span-3 block aspect-[16/10] overflow-hidden bg-cream min-[720px]:col-span-1 min-[720px]:h-[58px] min-[720px]:w-[92px]">
                <Image
                  src={n.eyecatch.url}
                  alt=""
                  fill
                  sizes="(min-width: 720px) 92px, 100vw"
                  className={`transition-transform duration-500 group-hover:scale-105 ${
                    isBadgeImage(n.eyecatch.url) ? "object-contain p-2" : "object-cover"
                  }`}
                />
              </span>
            ) : (
              <span className="hidden h-[58px] w-[92px] bg-cream min-[720px]:block" />
            )}
            <span className="font-mono text-[13px] tracking-[0.06em] text-muted">
              {n.date.replaceAll("-", ".")}
            </span>
            <span className="justify-self-start rounded-card border border-brand px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-brand">
              {n.category}
            </span>
            <span className="col-span-3 text-[15px] leading-[1.7] text-ink min-[720px]:col-span-1">
              {n.title}
            </span>
            <span
              aria-hidden
              className="hidden font-mono text-sm text-[#c9c6c0] min-[720px]:block"
            >
              →
            </span>
          </Link>
        ))}
        {shown.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">
            該当するニュースはありません。
          </p>
        )}
      </div>
    </>
  );
}
