"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** 限定案内は専用のヘッダー・フッターを使う。通常ページの導線は維持する。 */
export function PublicSiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname.replace(/\/$/, "") === "/introduction" ? null : children;
}
