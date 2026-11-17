import Link from "next/link";
import { DisplayText } from "@/components/ui/DisplayText";
import { TechBackdrop } from "@/components/ui/TechBackdrop";

export function PageHeader({
  title,
  en,
  current,
  titleAs: TitleTag = "h1",
}: {
  title: string;
  en: string;
  /** パンくず3階層目（記事タイトル等）。省略時は2階層 */
  current?: string;
  /** ページ本体に別の h1 がある場合は "p" を指定（h1重複の回避） */
  titleAs?: "h1" | "p";
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-cream">
      <TechBackdrop />
      {/* トップページと共通のディスプレイタイポ（縮小版）でデザイン言語を揃える */}
      <div className="pointer-events-none absolute -bottom-2 right-0 min-[720px]:-bottom-3">
        <DisplayText size="md">{en.toUpperCase()}</DisplayText>
      </div>
      <div className="relative mx-auto w-full max-w-[1160px] px-6 pb-12 pt-14 min-[720px]:pb-[58px] min-[720px]:pt-16">
        <nav
          aria-label="パンくずリスト"
          className="mb-5 font-mono text-[11px] tracking-[0.14em] text-muted"
        >
          <Link href="/" className="transition-colors hover:text-brand">
            HOME
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          {current ? (
            <>
              <Link
                href={`/${en.toLowerCase()}`}
                className="transition-colors hover:text-brand"
              >
                {en.toUpperCase()}
              </Link>
              <span aria-hidden className="mx-2">
                /
              </span>
              <span
                aria-current="page"
                className="inline-block max-w-[24em] truncate align-bottom font-sans tracking-normal"
              >
                {current}
              </span>
            </>
          ) : (
            <span aria-current="page">{en.toUpperCase()}</span>
          )}
        </nav>
        <div className="flex flex-wrap items-baseline gap-5">
          <TitleTag className="palt text-[34px] font-bold tracking-[-0.02em] text-ink min-[720px]:text-[46px]">
            {title}
          </TitleTag>
          <span className="font-mono text-[15px] font-semibold uppercase tracking-[0.14em] text-brand min-[720px]:text-[17px]">
            {en}
          </span>
        </div>
      </div>
    </section>
  );
}
