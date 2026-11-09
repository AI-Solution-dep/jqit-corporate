"use client";

import { useEffect } from "react";
import "./home-scroll-depth.css";

type Plane = { element: HTMLElement; anchor: HTMLElement; rate: number; limit: number; xRate: number; imageFrame?: HTMLElement };

// 全セクションに同じ装飾を繰り返さず、写真や本文の密度に合わせて数を変える。
const backgroundLayers: Record<string, readonly { shape: string; rate: number; xRate: number }[]> = {
  about: [{ shape: "about-frame", rate: 0.10, xRate: 0 }],
  business: [
    { shape: "business-blush-block", rate: -0.08, xRate: 0.04 },
    { shape: "business-circle", rate: 0.16, xRate: -0.06 },
  ],
  service: [],
  "tech-culture": [{ shape: "culture-route", rate: 0.08, xRate: 0.04 }],
};

/** 冒頭の確定演出には触れず、下のセクションだけにスクロールによる奥行きを付ける。 */
export function HomeScrollDepth({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-scroll-depth]");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const planes: Plane[] = [];
    const decorations: HTMLElement[] = [];
    const imageFrames: HTMLElement[] = [];
    const placements: { element: HTMLElement; section: HTMLElement; target: HTMLElement; shape: string }[] = [];
    let layoutPending = true;
    const selected = enabled;
    let frame = 0;
    let active = true;
    const addPlane = (element: HTMLElement | null, anchor: HTMLElement | null, rate: number, limit: number, layer: string, xRate = 0) => {
      if (!element || !anchor) return;
      element.dataset.depthPlane = layer;
      planes.push({ element, anchor, rate, limit, xRate });
    };
    const addImage = (image: HTMLImageElement | null, anchor: HTMLElement, rate: number) => {
      if (!image?.parentElement) return;
      const imageFrame = image.parentElement;
      imageFrame.dataset.depthImageFrame = "";
      imageFrame.style.setProperty("--depth-photo-radius", getComputedStyle(image).borderRadius);
      imageFrames.push(imageFrame);
      addPlane(image, anchor, rate, 32, "image");
      planes[planes.length - 1].imageFrame = imageFrame;
    };
    const sections = ["about", "business", "service", "tech-culture"];
    sections.forEach(id => {
      const section = root.querySelector<HTMLElement>(`#${id}`);
      if (!section) return;
      const layers = backgroundLayers[id];
      if (layers.length) {
        const backgroundWindow = document.createElement("div");
        backgroundWindow.className = "jqit-depth-window";
        backgroundWindow.setAttribute("aria-hidden", "true");
        section.appendChild(backgroundWindow);
        decorations.push(backgroundWindow);
        layers.forEach(({ shape, rate, xRate }) => {
          const background = document.createElement("div");
          background.className = `jqit-depth-backdrop jqit-depth-backdrop--${shape}`;
          background.dataset.depthShape = shape;
          const geometry = document.createElement("div");
          geometry.className = "jqit-depth-geometry";
          background.appendChild(geometry);
          backgroundWindow.appendChild(background);
          const targetSelector = shape === "about-frame" ? ".grid.border"
            : shape === "business-circle" ? ".space-y-16 > .reveal:first-child > div:first-child"
            : shape === "business-blush-block" ? ".space-y-16 > .reveal:nth-child(2) > div:first-child"
            : ".grid";
          const target = section.querySelector<HTMLElement>(targetSelector);
          if (target) placements.push({ element: background, section, target, shape });
          addPlane(background, section, rate, 80, "background", xRate);
        });
      }
      const heading = section.querySelector<HTMLElement>('p[aria-hidden]');
      addPlane(heading, heading?.parentElement ?? null, -0.14, 36, "heading");
    });
    root.querySelectorAll<HTMLElement>("#business .space-y-16 > .reveal").forEach((row, index) => {
      const picture = row.firstElementChild as HTMLElement;
      addPlane(picture, row, -0.18, 96, "photo");
      addImage(picture.querySelector<HTMLImageElement>("img:not([data-business-detail])"), row, index === 0 ? -0.075 : 0.06);
      addPlane(picture.querySelector<HTMLElement>("span[aria-hidden]"), row, -0.025, 12, "foreground");
    });
    root.querySelectorAll<HTMLElement>("#service article").forEach((article, index) => {
      addPlane(article, article.parentElement, index === 0 ? -0.10 : -0.15, 64, "card");
      // 製品画面は読める状態を保ち、人物の写真だけを動かす。
      const photo = article.querySelector<HTMLImageElement>('img[src*="business-ai"]');
      if (article.parentElement) addImage(photo, article.parentElement, -0.05);
    });
    root.querySelectorAll<HTMLElement>("#tech-culture .grid > a").forEach((card, index) => addPlane(card, card.parentElement, -0.06 - index * 0.035, 56, "card"));

    // 模様をセクションの割合ではなく、写真・情報ブロックの輪郭へ結び付ける。
    const layoutPatterns = () => {
      const mobile = window.innerWidth < 1000;
      const layouts = placements.map(({ element, section, target, shape }) => {
        const sectionBox = section.getBoundingClientRect();
        const box = target.getBoundingClientRect();
        let visualOffset = 0;
        for (let node: HTMLElement | null = target; node && node !== section; node = node.parentElement) {
          const transform = getComputedStyle(node).transform;
          if (transform !== "none") visualOffset += new DOMMatrixReadOnly(transform).m42;
        }
        const targetY = box.top - sectionBox.top - visualOffset;
        const targetX = box.left - sectionBox.left;
        if (shape === "about-frame") return { element, left: targetX + 20, top: targetY - (mobile ? 40 : 64), width: box.width + (mobile ? 100 : 180), height: box.height + (mobile ? 60 : 90) };
        if (shape === "business-circle") {
          const size = box.width * 1.18;
          return { element, left: targetX - box.width * 0.13, top: targetY + (mobile ? 12 : 24), width: size, height: size };
        }
        if (shape === "business-blush-block") {
          const size = box.width * 1.3;
          return { element, left: targetX - (mobile ? 24 : 48), top: targetY + (mobile ? 24 : 32), width: size, height: size };
        }
        const width = mobile ? 560 : 700;
        return { element, left: targetX + box.width - (mobile ? 140 : 220), top: targetY - (mobile ? 180 : 260), width, height: width * 460 / 560 };
      });
      layouts.forEach(({ element, left, top, width, height }) => {
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
      });
    };

    const update = () => {
      frame = 0;
      if (!active) return;
      if (layoutPending) { layoutPatterns(); layoutPending = false; }
      const moving = selected && !reduce.matches;
      root.dataset.scrollDepth = reduce.matches ? "reduced" : moving ? "on" : "off";
      const height = window.innerHeight;
      const strength = window.innerWidth < 720 ? 0.65 : 1;
      // 先に全ての位置を読み、最後にまとめて描画値を書く。
      const bounds = new Map<HTMLElement, DOMRect>();
      planes.forEach(({ element, anchor, imageFrame }) => {
        if (!bounds.has(anchor)) bounds.set(anchor, anchor.getBoundingClientRect());
        if (imageFrame && !bounds.has(imageFrame)) bounds.set(imageFrame, imageFrame.getBoundingClientRect());
        const geometry = element.querySelector<HTMLElement>(".jqit-depth-geometry");
        if (geometry) bounds.set(geometry, geometry.getBoundingClientRect());
      });
      const positions = planes.map(({ element, anchor, rate, limit, xRate, imageFrame }) => {
        const rect = bounds.get(anchor)!;
        // セクションの長さで割らず、スクロール距離に対して直接速度差を作る。
        const distance = height / 2 - rect.top - rect.height / 2;
        const isImage = element.dataset.depthPlane === "image";
        const imageLimit = imageFrame ? Math.min(limit * strength, bounds.get(imageFrame)!.height * 0.045) : 0;
        const isBackground = element.dataset.depthPlane === "background";
        // 内容は画面の読み取り位置へ来たら本来の配置に着地し、その先もずらさない。
        // 背景だけは連続して動かし、奥行きの体験を維持する。
        const entry = Math.max(0, Math.min(1, (rect.top - height * 0.60) / (height * 0.40)));
        const entryEase = entry * entry * (3 - 2 * entry);
        const entryLimit = window.innerWidth < 720 && element.dataset.depthPlane === "photo" ? 16 : limit * strength;
        const position = {
          y: !moving ? 0 : isImage
            ? Math.max(-imageLimit, Math.min(imageLimit, distance * rate * strength))
            : isBackground
            ? Math.max(-limit, Math.min(limit, distance * rate)) * strength
            : entryLimit * entryEase,
          x: moving ? Math.max(-80, Math.min(80, distance * xRate)) * strength : 0,
        };
        if (isBackground && moving) {
          const geometry = element.querySelector<HTMLElement>(".jqit-depth-geometry")!;
          const shape = bounds.get(geometry)!;
          if (window.innerWidth < 1000 && element.dataset.depthShape === "about-frame") {
            // 縦並びでは、枠の上辺を会社情報ブロック直前の余白から本文へ戻さない。
            position.y = Math.max(0, Math.min(24, position.y));
          }
          // 横は画面端へ自然に抜けさせ、上下だけセクション内に保つ。
          const previousY = parseFloat(element.style.getPropertyValue("--depth-y")) || 0;
          position.y = Math.max(rect.top + 16 - shape.top + previousY, Math.min(rect.bottom - 16 - shape.bottom + previousY, position.y));
        }
        return position;
      });
      planes.forEach(({ element }, index) => {
        element.style.setProperty("--depth-y", `${positions[index].y.toFixed(2)}px`);
        element.style.setProperty("--depth-x", `${positions[index].x.toFixed(2)}px`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onScroll = () => schedule();
    const onResize = () => { layoutPending = true; schedule(); };
    const resize = new ResizeObserver(onResize);
    sections.forEach(id => { const section = root.querySelector(`#${id}`); if (section) resize.observe(section); });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    reduce.addEventListener("change", schedule);
    document.fonts.ready.then(() => { if (active) onResize(); });
    schedule();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", schedule);
      decorations.forEach(element => element.remove());
      imageFrames.forEach(element => { delete element.dataset.depthImageFrame; element.style.removeProperty("--depth-photo-radius"); });
      planes.forEach(({ element }) => { delete element.dataset.depthPlane; element.style.removeProperty("--depth-y"); element.style.removeProperty("--depth-x"); });
    };
  }, [enabled]);
  return null;
}
