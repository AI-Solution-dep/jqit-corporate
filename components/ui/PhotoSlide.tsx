"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * 写真の中身のスライド。data-photo-slide を付けた写真は、枠を固定したまま、
 * 中の写真だけがスクロールに合わせて上下に動く（写真は少し拡大して、動いても端に空白が出ないようにする）。
 * - 動く量は「普通に気づく」程度：写真の高さの最大10%（上限64px）。控えめにしない。
 * - 図解・製品画面・ロゴには付けない（切り取ると情報が欠けるため）。
 * - reduced-motion では動かさない。
 */
export function PhotoSlide() {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let photos: HTMLElement[] = [];
    let frame = 0;

    const paint = () => {
      frame = 0;
      const height = window.innerHeight;
      photos.forEach((photo) => {
        const frameBox = (photo.parentElement ?? photo).getBoundingClientRect();
        if (frameBox.bottom < -100 || frameBox.top > height + 100) return;
        // 写真の中心が画面の中心にあるとき 0、画面の上下端に近づくほど ±1。
        const progress = Math.max(-1, Math.min(1, (frameBox.top + frameBox.height / 2 - height / 2) / height));
        const distance = Math.min(64, frameBox.height * 0.1);
        photo.style.setProperty("--photo-y", `${media.matches ? 0 : (progress * distance).toFixed(2)}px`);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const collect = () => {
      photos = Array.from(document.querySelectorAll<HTMLElement>("#main [data-photo-slide]"));
      schedule();
    };

    collect();
    const main = document.getElementById("main");
    const mutations = new MutationObserver(collect);
    if (main) mutations.observe(main, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      photos.forEach((photo) => photo.style.removeProperty("--photo-y"));
    };
  }, [pathname]);

  return null;
}
