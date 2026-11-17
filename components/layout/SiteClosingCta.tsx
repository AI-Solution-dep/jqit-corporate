"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

// お問い合わせページ自身と、専用の作りを持つ未公開・限定ページには出さない。
const hiddenPrefixes = ["/contact", "/introduction", "/design-lab", "/demo-gallery", "/dispatch-disclosure"];

/** 全ページの最後に置く、画面幅いっぱいの相談導線。フッターの直前に来る。 */
export function SiteClosingCta() {
  const pathname = usePathname() ?? "/";
  if (hiddenPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return null;

  return (
    <section aria-labelledby="site-closing-cta-title" className="site-closing-cta">
      <div className="site-closing-cta-inner mx-auto w-full max-w-[1160px] px-6">
        <div className="site-closing-cta-copy">
          <p className="site-closing-cta-kicker font-mono">
            <span aria-hidden />
            Contact
          </p>
          <h2 id="site-closing-cta-title" className="palt">
            課題の<span>“本質”</span>から、
            <br />
            一緒に考えます。
          </h2>
          <p className="site-closing-cta-lead">
            ご相談の段階は問いません。システム開発、AI活用、エンジニアの体制づくりまで、まずはお気軽にお話しください。
          </p>
        </div>
        <div className="site-closing-cta-actions">
          <a href={siteConfig.telHref} className="site-closing-cta-tel">
            <span className="font-mono">TEL</span>
            {siteConfig.tel}
          </a>
          <p className="site-closing-cta-hours">{siteConfig.businessHours}</p>
        </div>
      </div>
      <Link href="/contact" className="site-closing-cta-link">
        <span className="site-closing-cta-word palt">お問い合わせフォームへ</span>
        <span aria-hidden className="site-closing-cta-arrow">
          <svg viewBox="0 0 64 32" fill="none">
            <path d="M2 16h56M44 3l14 13-14 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </section>
  );
}
