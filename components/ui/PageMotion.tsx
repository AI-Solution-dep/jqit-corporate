"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** 下層の背景はゆっくり、写真は小さく逆方向へ。文字と写真の枠は固定する。 */
export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let sections: HTMLElement[] = [];
    let photos: HTMLElement[] = [];
    let frame = 0;
    const paint = () => {
      frame = 0;
      const height = window.innerHeight;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > height + 200) return;
        const progress = Math.max(-1, Math.min(1, (height / 2 - rect.top) / (height + rect.height / 2)));
        const fade = Math.max(0, Math.min(1, (height * .25 - rect.top) / (height + rect.height * .3)));
        section.style.setProperty("--depth-opacity", `${media.matches ? 1 : 1 - fade * .9}`);
        // 面は本文の外側の余白に収めているので、横には動かさない。
        section.style.setProperty("--depth-x", `${media.matches || section.dataset.depthPattern === "plane" ? 0 : progress * 24}px`);
        section.style.setProperty("--depth-y", `${media.matches ? 0 : progress * 100}px`);
      });
      photos.forEach((photo, index) => {
        const rect = photo.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, (height / 2 - rect.top - rect.height / 2) / (height * .7)));
        // 移動は写真の高さの4%以内。拡大で生まれる余白の範囲内に収める。
        const distance = Math.min(24, rect.height * .04);
        photo.style.setProperty("--photo-y", `${media.matches ? 0 : progress * distance * (index % 2 ? 1 : -1)}px`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const collect = () => {
      const authored = Array.from(main.querySelectorAll<HTMLElement>(":scope > section[data-depth-scene]"));
      const first = main.querySelector<HTMLElement>(":scope > section:not(.brand-page-header)");
      sections = authored.length ? authored : first ? [first] : [];
      // data-depth-scene は "route"（ルート線）か "plane"（一角だけ曲げた薄赤の面）。続くセクションは左右を入れ替える。
      sections.forEach((section, index) => {
        section.dataset.depthPattern = section.dataset.depthScene === "plane" ? "plane" : "route";
        section.dataset.depthSide = index % 2 ? "left" : "right";
      });
      photos = Array.from(main.querySelectorAll<HTMLElement>("[data-depth-photo]"));
      schedule();
    };
    collect();
    const mutations = new MutationObserver(collect);
    mutations.observe(main, { childList: true, subtree: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(main);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      sections.forEach((section) => {
        delete section.dataset.depthPattern;
        delete section.dataset.depthSide;
        section.style.removeProperty("--depth-y");
        section.style.removeProperty("--depth-x");
        section.style.removeProperty("--depth-opacity");
      });
      photos.forEach((photo) => photo.style.removeProperty("--photo-y"));
    };
  }, [pathname]);

  return null;
}
