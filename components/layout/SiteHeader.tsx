"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { globalNav, siteConfig } from "@/lib/site-config";

function BrandLogo() {
  return (
    <Link href="/" className="flex items-baseline gap-2.5">
      <Image
        src="/jqit-logo.png"
        alt={siteConfig.name}
        width={425}
        height={118}
        priority
        className="h-[30px] w-auto"
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        Corporate
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) =>
    !href.startsWith("http") &&
    !href.startsWith("/#") &&
    (pathname === href || pathname.startsWith(`${href}/`));

  /** 親項目のアクティブ判定: 自身 or 配下ページのいずれかが現在地 */
  const isParentActive = (item: (typeof globalNav)[number]) =>
    isActive(item.href) || (item.children?.some((c) => isActive(c.href)) ?? false);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDropdown();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeDropdown]);

  // モバイルメニュー展開中: 背景スクロールロック + Escape で閉じる + フォーカストラップ
  useEffect(() => {
    if (!open) return;
    // body を fixed 化して背景スクロールを完全に遮断（programmatic scroll 含む）
    const scrollY = window.scrollY;
    const { position, top, left, right, width } = document.body.style;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.left = left;
      document.body.style.right = right;
      document.body.style.width = width;
      // scroll-behavior:smooth の影響を受けないよう即時復元
      window.scrollTo({ top: scrollY, behavior: "instant" });
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md backdrop-saturate-125">
      <div className="mx-auto flex h-[72px] w-full max-w-[1160px] items-center justify-between gap-6 px-6">
        <BrandLogo />

        {/* PC nav */}
        <nav
          aria-label="グローバルナビゲーション"
          className="hidden items-center gap-7 min-[960px]:flex"
        >
          {globalNav.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center gap-[3px] py-1.5 transition-opacity hover:opacity-70"
              >
                <span className="text-[13px] font-semibold text-ink">
                  {item.label}
                  <span aria-hidden className="ml-1 font-mono text-[10px] text-muted">
                    ↗
                  </span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  {item.en}
                </span>
              </a>
            ) : (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={closeDropdown}
                onFocus={() => item.children && setActiveDropdown(item.label)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) closeDropdown();
                }}
              >
                <Link
                  href={item.href}
                  onClick={closeDropdown}
                  className="relative flex flex-col items-center gap-[3px] py-1.5 transition-opacity hover:opacity-70"
                >
                  <span className="text-[13px] font-semibold text-ink">
                    {item.label}
                    {item.children && (
                      <span
                        aria-hidden
                        className={`ml-1 inline-block font-mono text-[9px] text-muted transition-transform duration-200 ${
                          activeDropdown === item.label ? "translate-y-[1px]" : ""
                        }`}
                      >
                        ▾
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {item.en}
                  </span>
                  {isParentActive(item) && (
                    <span
                      aria-hidden
                      className="absolute -bottom-px left-1/2 h-0.5 w-[18px] -translate-x-1/2 bg-brand"
                    />
                  )}
                </Link>

                {/* ドロップダウン（hover / キーボードフォーカスで表示） */}
                {item.children && (
                  <div
                    className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2.5 transition-all duration-200 ${
                      activeDropdown === item.label
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                    }`}
                  >
                    <div className="min-w-[248px] border border-line border-t-2 border-t-brand bg-white py-2.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          target={child.external ? "_blank" : undefined}
                          rel={child.external ? "noopener noreferrer" : undefined}
                          onClick={closeDropdown}
                          className={`group/dd flex items-center justify-between gap-4 px-5 py-[11px] text-[13px] font-semibold transition-colors hover:bg-cream hover:text-brand ${
                            isActive(child.href) ? "text-brand" : "text-ink"
                          }`}
                        >
                          {child.label}
                          <span
                            aria-hidden
                            className="font-mono text-[11px] text-muted/40 transition-all duration-200 group-hover/dd:translate-x-0.5 group-hover/dd:text-brand"
                          >
                            {child.external ? "↗" : "→"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ),
          )}
        </nav>

        <Link
          href="/contact"
          className="hidden items-center gap-2 whitespace-nowrap rounded-button bg-brand px-5 py-[11px] text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark min-[960px]:inline-flex"
        >
          お問い合わせ
          <span aria-hidden className="font-mono text-[13px]">
            →
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => (open ? close() : setOpen(true))}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 min-[960px]:hidden"
        >
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${open ? "translate-y-1 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`}
          />
          <span className="sr-only">メニュー</span>
        </button>
      </div>

      {/* Mobile nav（フルスクリーン・テイクオーバー: 画面下端まで bg-ink で覆う。
          背景コンテンツが透けないため別オーバーレイは不要。
          スクロールロック + Escape + フォーカストラップは上の useEffect で処理 */}
      {open && (
        <nav
          ref={panelRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="メニュー"
          className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-72px)] overflow-y-auto bg-ink px-6 pb-12 pt-3 min-[960px]:hidden"
        >
          {globalNav.map((item) => {
            const inner = (
              <>
                <span className="palt text-[26px] font-bold text-white">
                  {item.label}
                  {item.external && (
                    <span aria-hidden className="ml-2 font-mono text-[13px] text-white/40">
                      ↗
                    </span>
                  )}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {item.en}
                </span>
              </>
            );
            const cls = `flex items-baseline justify-between gap-3 px-1 ${
              item.children ? "pt-5 pb-3" : "border-b border-white/15 py-5"
            }`;
            return item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
                onClick={close}
              >
                {inner}
              </a>
            ) : (
              <div key={item.label} className={item.children ? "border-b border-white/15" : ""}>
                <Link href={item.href} className={cls} onClick={close}>
                  {inner}
                </Link>
                {/* 配下ページへの直リンク（常時展開） */}
                {item.children && (
                  <div className="flex flex-col gap-1 pb-5 pl-5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        target={child.external ? "_blank" : undefined}
                        rel={child.external ? "noopener noreferrer" : undefined}
                        onClick={close}
                        className="flex items-center gap-2.5 py-1.5 text-[14px] font-semibold text-white/70"
                      >
                        <span aria-hidden className="h-px w-3.5 bg-brand" />
                        {child.label}
                        {child.external && (
                          <span aria-hidden className="font-mono text-[11px] text-white/35">
                            ↗
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/contact"
            onClick={close}
            className="mt-9 flex items-center justify-center gap-2 rounded-button bg-brand px-5 py-4 text-[15px] font-semibold text-white"
          >
            お問い合わせ
            <span aria-hidden className="font-mono">
              →
            </span>
          </Link>
          <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">
            {siteConfig.nameEn}
          </p>
        </nav>
      )}
    </header>
  );
}
