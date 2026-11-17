import type { ReactNode } from "react";

export function PhotoDepth({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div data-depth-photo className={`brand-photo-depth ${className}`}>{children}</div>;
}
