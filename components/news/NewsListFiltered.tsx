"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { MicroCMSImage } from "@/lib/microcms";

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
  const categories = Array.from(
    new Set(items.map((n) => n.category).filter((category) => category.trim() !== "")),
  );
  const tabs = [ALL, ...categories];
  const shown = active === ALL ? items : items.filter((n) => n.category === active);

  return (
    <>
      <div
        role="tablist"
        aria-label="カテゴリで絞り込み"
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
                  ? "border-warm font-semibold text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
      <div>
        {shown.map((n) => (
          <Link
            key={n.id}
            href={`/news/${n.id}`}
            className="group grid grid-cols-[112px_auto_1fr] items-center gap-x-4 gap-y-2 border-b border-line px-1 py-[18px] transition-[background-color,box-shadow] duration-300 hover:bg-white hover:shadow-hover-lift min-[720px]:grid-cols-[96px_130px_110px_1fr_auto] min-[720px]:gap-6 min-[720px]:py-[22px]"
          >
            {n.eyecatch ? (
              <span className="relative row-span-2 block h-[70px] w-[112px] overflow-hidden bg-cream min-[720px]:row-span-1 min-[720px]:h-[58px] min-[720px]:w-[92px]">
                <Image
                  src={n.eyecatch.url}
                  alt=""
                  fill
                  sizes="(min-width: 720px) 92px, 112px"
                  className={`transition-transform duration-500 group-hover:scale-105 ${
                    isBadgeImage(n.eyecatch.url) ? "object-contain p-2" : "object-cover"
                  }`}
                />
              </span>
            ) : (
              <span className="row-span-2 block h-[70px] w-[112px] bg-cream min-[720px]:row-span-1 min-[720px]:h-[58px] min-[720px]:w-[92px]" />
            )}
            <span className="font-mono text-[13px] tracking-[0.06em] text-muted">
              {n.date.replaceAll("-", ".")}
            </span>
            <span className="justify-self-start rounded-label border border-warm px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-warm-ink">
              {n.category}
            </span>
            <span className="col-span-2 text-[14px] leading-[1.6] text-ink min-[720px]:col-span-1 min-[720px]:text-[15px] min-[720px]:leading-[1.7]">
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
