"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

// 最初の読み込みでは幕を出さない。2回目以降のマウント（＝サイト内のページ遷移）だけで出す。
// サーバー側では常に false のままなので、初回のハイドレーションと食い違わない。
let hasMounted = false;
// 戻る／進むでは、ブラウザが元のスクロール位置を復元する。その画面を幕で隠さない。
let isHistoryNavigation = false;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    isHistoryNavigation = true;
  });
}

/**
 * ページ遷移の幕。淡い赤の面がヘッダーの下を覆い、右下の曲線を先頭にして上へ抜ける。
 * app/template.tsx は第1階層が変わるときしか作り直されないため、
 * /business/it-solutions → /business/ai-solutions のような同じ階層の中の遷移にも出すよう、パスを key にして作り直す。
 * TOP へ戻るときは、ヒーローの登場演出があるので幕を出さない。
 */
export function PageCurtain() {
  const pathname = usePathname();
  return <Curtain key={pathname} home={pathname === "/"} />;
}

function Curtain({ home }: { home: boolean }) {
  // 初期値の時点で決める：遷移かどうか、幕を出すかどうか。
  const navigatedRef = useRef(hasMounted);
  const [visible, setVisible] = useState(
    () =>
      hasMounted &&
      !home &&
      !isHistoryNavigation &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const startedRef = useRef(visible);

  useLayoutEffect(() => {
    hasMounted = true;
    isHistoryNavigation = false;
    if (!navigatedRef.current) return;

    // 遷移後のキーボード操作を本文の先頭から始める（フッターのリンクにフォーカスが残らないように）。
    const main = document.getElementById("main");
    if (main) {
      if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }

    if (!startedRef.current) return;
    const hideCurtain = window.setTimeout(() => setVisible(false), 1000);
    return () => window.clearTimeout(hideCurtain);
  }, []);

  if (!visible) return null;
  return <div aria-hidden className="page-curtain" />;
}
