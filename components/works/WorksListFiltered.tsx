"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Work } from "@/lib/works";

const ALL = "すべて";

type Item = Pick<
  Work,
  | "id"
  | "title"
  | "client"
  | "industry"
  | "serviceType"
  | "period"
  | "summary"
  | "metrics"
  | "eyecatch"
  | "isDiagram"
>;

export function WorksListFiltered({ items }: { items: Item[] }) {
  const [active, setActive] = useState(ALL);
  const services = Array.from(
    new Set(items.map((w) => w.serviceType).filter((s) => s.trim() !== "")),
  );
  const tabs = [ALL, ...services];
  const shown = active === ALL ? items : items.filter((w) => w.serviceType === active);

  return (
    <>
      <div
        role="tablist"
        aria-label="提供サービスで絞り込み"
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

      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 min-[720px]:grid-cols-2">
        {shown.map((w) => (
          <Link
            key={w.id}
            href={`/works/${w.id}`}
            className="group flex flex-col border-b border-line pb-8"
          >
            <span className="relative block aspect-[16/10] overflow-hidden bg-cream">
              {w.eyecatch ? (
                <Image
                  src={w.eyecatch.url}
                  alt=""
                  fill
                  sizes="(min-width: 720px) 540px, 100vw"
                  className={
                    w.isDiagram
                      ? "object-contain p-4"
                      : "object-cover transition-transform duration-500 group-hover:scale-105"
                  }
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.24em] text-[#c9c6c0]">
                  JQIT Works
                </span>
              )}
            </span>

            <span className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-card border border-brand px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-brand">
                {w.serviceType}
              </span>
              <span className="rounded-card border border-line px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-muted">
                {w.industry}
              </span>
            </span>

            <span className="palt mt-4 text-[20px] font-bold leading-[1.55] tracking-[-0.02em] text-ink transition-colors group-hover:text-brand">
              {w.title}
            </span>

            <span className="mt-2.5 font-mono text-[12px] tracking-[0.06em] text-muted">
              {w.client}
              {w.period ? `　/　${w.period}` : ""}
            </span>

            {w.summary && (
              <span className="mt-3.5 text-[14px] leading-[1.95] text-body">
                {w.summary}
              </span>
            )}

            {w.metrics.length > 0 && (
              <span className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                {w.metrics.slice(0, 3).map((m) => (
                  <span key={m.label} className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                      {m.label}
                    </span>
                    <span className="mt-1 font-mono text-[20px] font-bold tracking-[-0.01em] text-brand">
                      {m.value}
                    </span>
                  </span>
                ))}
              </span>
            )}
          </Link>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="py-16 text-center text-sm text-muted">
          該当する実績はありません。
        </p>
      )}
    </>
  );
}
