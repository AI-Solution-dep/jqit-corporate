import Image from "next/image";
import Link from "next/link";
import { certificationBadges, footerNav, siteConfig } from "@/lib/site-config";

const socialLinks = [
  { label: "X", href: siteConfig.links.x },
  { label: "Instagram", href: siteConfig.links.instagram },
  { label: "Qiita", href: siteConfig.links.qiita },
  { label: "note", href: siteConfig.links.note },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink bg-paper pb-8 pt-[72px] text-ink">
      <div className="mx-auto w-full max-w-[1160px] px-6">
        <div className="grid grid-cols-1 gap-10 border-b border-line pb-12 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4">
              <Image
                src="/jqit-logo.png"
                alt={siteConfig.name}
                width={425}
                height={118}
                className="h-[34px] w-auto"
              />
            </div>
            <p className="max-w-[300px] text-[13px] leading-loose text-body">
              {siteConfig.tagline}
              <br />
              技術の力で、お客様の“本質的な課題”を解決します。
            </p>
            <p className="mt-5 font-mono text-[11px] leading-[1.9] tracking-[0.1em] text-muted">
              {siteConfig.addressLines[0]}
              <br />
              {siteConfig.addressLines[1]}
              <br />
              TEL {siteConfig.tel} ／ FAX {siteConfig.fax}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-[0.08em] text-muted transition-colors hover:text-brand"
                >
                  {s.label}
                  <span aria-hidden className="ml-1">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((col) => (
            <nav key={col.head} aria-label={col.head}>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
                {col.head}
              </p>
              <div className="flex flex-col gap-3">
                {col.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-body transition-colors hover:text-brand"
                    >
                      {link.label}
                      <span aria-hidden className="ml-1 font-mono text-[10px] text-muted">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-[13px] text-body transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-9 gap-y-3 border-b border-line py-6">
          {certificationBadges.map((c) =>
            c.image ? (
              <Image
                key={c.label}
                src={c.image.src}
                alt={c.label}
                width={c.image.width}
                height={c.image.height}
                className="h-7 w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            ) : (
              <span
                key={c.label}
                className="rounded-card border border-line px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] text-muted"
              >
                {c.label}
              </span>
            ),
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 pt-6">
          <p className="font-mono text-[11px] tracking-[0.12em] text-muted">
            © 2026 {siteConfig.nameEn} All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="text-xs text-muted transition-colors hover:text-brand"
            >
              プライバシーポリシー
            </Link>
            <a
              href="/sitemap.xml"
              className="text-xs text-muted transition-colors hover:text-brand"
            >
              サイトマップ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
