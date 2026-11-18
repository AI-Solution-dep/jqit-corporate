import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "arrow";

const base =
  "group inline-flex items-center font-bold text-sm tracking-[0.02em] transition-all duration-300 ease-out";

const variants: Record<Variant, string> = {
  primary:
    "gap-3 bg-brand text-white px-8 py-[15px] rounded-button hover:bg-brand-dark active:translate-y-px",
  outline:
    "gap-3 border border-ink text-ink px-8 py-[14px] rounded-button hover:bg-ink hover:text-white active:translate-y-px",
  arrow:
    "gap-2.5 font-mono font-semibold text-[13px] tracking-[0.12em] text-ink border-b border-ink pt-4 pb-2.5 hover:text-brand hover:border-brand",
};

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="10"
      viewBox="0 0 20 10"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
    >
      <path
        d="M0.75 5H18M13.5 1 18 5l-4.5 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Button({
  href,
  variant = "primary",
  external = false,
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  // 別サイトへ出るボタンは、矢印を ↗ にして行き先の違いを示す
  const isExternal = external || href.startsWith("http");
  const content = (
    <>
      <span>{children}</span>
      {variant !== "arrow" && !isExternal && <ArrowIcon />}
      {variant !== "arrow" && isExternal && (
        <span aria-hidden className="text-[13px] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          ↗
        </span>
      )}
      {variant === "arrow" && (
        <span
          aria-hidden
          className="font-mono transition-transform duration-300 ease-out group-hover:translate-x-1.5"
        >
          →
        </span>
      )}
    </>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
