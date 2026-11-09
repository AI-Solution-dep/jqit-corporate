"use client";

import { useEffect } from "react";
import "./hero-entrance.css";

export type HeroEntranceVariant = "current" | "motion" | "curve";

/** 文字ごとの表示領域を測る。元の文字組みは組み直さない。 */
function characterRegions(element: HTMLElement) {
  const bounds = element.getBoundingClientRect();
  const regions: { left: number; right: number }[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    let offset = 0;
    for (const character of Array.from(node.textContent ?? "")) {
      const next = offset + character.length;
      if (!/\s/u.test(character)) {
        const range = document.createRange();
        range.setStart(node, offset);
        range.setEnd(node, next);
        const glyph = range.getBoundingClientRect();
        regions.push({ left: ((glyph.left - bounds.left) / bounds.width) * 100, right: Math.max(0, 100 - ((glyph.right - bounds.left) / bounds.width) * 100) });
      }
      offset = next;
    }
  }
  return regions;
}

/** 確定した登場順と速度を、トップ本体と比較画面で共有する。 */
export function HeroEntrance({ variant = "motion", preview = false }: { variant?: HeroEntranceVariant; preview?: boolean }) {
  useEffect(() => {
    const originalScrollRestoration = window.history.scrollRestoration;
    if (preview) window.history.scrollRestoration = "manual";
    const root = document.querySelector<HTMLElement>(preview ? "[data-top-variant]" : "[data-home-entrance]");
    const hero = root?.querySelector<HTMLElement>("section");
    if (!root || !hero) return;
    root.querySelector<HTMLButtonElement>('button[aria-label="画像の自動切り替えを一時停止"]')?.click();
    const header = document.querySelector<HTMLElement>("body > header");
    const lines = Array.from(hero.querySelectorAll<HTMLElement>("h1 > .hero-rise"));
    const extras = Array.from(hero.querySelectorAll<HTMLElement>(".hero-rise")).filter(element => !lines.includes(element));
    const button = extras.find(element => element.querySelector('a[href="/#business"]'));
    const kicker = extras[0];
    const supporting = extras.filter(element => element !== button && element !== kicker);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const carouselControls = hero.querySelector<HTMLElement>('[aria-label="トップ画像の切り替え"]');
    const inertTargets = [header, button, carouselControls].filter((element): element is HTMLElement => Boolean(element));
    const originalInert = inertTargets.map(element => element.inert);
    let animations: Animation[] = [];
    let glyphLayers: { line: HTMLElement; style: string | null; layers: HTMLElement[] }[] = [];
    const restoreText = () => {
      glyphLayers.forEach(({ line, style, layers }) => {
        layers.forEach(layer => layer.remove());
        line.classList.remove("top-type-host");
        if (style === null) line.removeAttribute("style");
        else line.setAttribute("style", style);
      });
      glyphLayers = [];
    };
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let fontTimer: ReturnType<typeof setTimeout> | undefined;

    const cancel = () => {
      animations.forEach(animation => animation.cancel());
      animations = [];
      window.clearTimeout(timer);
      restoreText();
      inertTargets.forEach((element, index) => { element.inert = originalInert[index]; });
      root.dataset.topInitial = "ready";
    };
    const report = (state: string) => {
      root.dataset.playback = state;
      if (preview) window.parent.postMessage({ type: "top-playback", state, variant }, window.location.origin);
    };
    const play = () => {
      cancel();
      if (preview) window.scrollTo({ top: 0, behavior: "instant" });
      if (variant !== "motion" || reduce.matches) { report(reduce.matches && variant === "motion" ? "reduced" : "complete"); return; }
      report("playing");
      inertTargets.forEach(element => { element.inert = true; });
      const fade = (element: HTMLElement, delay: number, duration: number) => {
        animations.push(element.animate([
          { opacity: 0, transform: "translate3d(0, 5px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ], { duration, delay, easing: "cubic-bezier(.2,.75,.25,1)", fill: "backwards" }));
      };
      const type = (line: HTMLElement, start: number, interval: number, fadeDuration: number) => {
        const regions = characterRegions(line);
        const color = getComputedStyle(line).color;
        const originalStyle = line.getAttribute("style");
        const template = line.cloneNode(true) as HTMLElement;
        const layers = regions.map(({ left, right }, i) => {
          const glyph = template.cloneNode(true) as HTMLElement;
          glyph.classList.remove("hero-rise");
          glyph.setAttribute("aria-hidden", "true");
          glyph.dataset.topGlyph = String(i);
          Object.assign(glyph.style, {
            position: "absolute", inset: "0", width: "100%", height: "100%",
            display: "block", color, pointerEvents: "none", whiteSpace: "nowrap",
            clipPath: `inset(-30% ${right}% -30% ${left}%)`,
          });
          line.appendChild(glyph);
          animations.push(glyph.animate([{ opacity: 0 }, { opacity: 1 }], {
            delay: start + i * interval, duration: fadeDuration,
            easing: "cubic-bezier(.2,.65,.35,1)", fill: "backwards",
          }));
          return glyph;
        });
        glyphLayers.push({ line, style: originalStyle, layers });
        line.classList.add("top-type-host");
        line.style.position = "relative";
        line.dataset.typeStart = String(start);
        line.dataset.typeDuration = String(regions.length * interval);
        return Math.max(0, regions.length - 1) * interval + fadeDuration;
      };
      // 小さな肩ラベルを先に左から打ち、その後で主役のコピーをゆっくり見せる。
      const kickerText = kicker?.querySelector<HTMLElement>("p > span:last-child");
      const kickerEnd = kickerText ? 120 + type(kickerText, 120, 45, 140) : 200;
      let cursor = kickerEnd + 250;
      root.dataset.kickerEnd = String(kickerEnd);
      lines.forEach((line, index) => {
        const count = characterRegions(line).length;
        type(line, cursor, 150, 200);
        cursor += count * 150 + (index < lines.length - 1 ? 400 : 0);
      });
      // 説明を受け止める間を置き、最後にナビゲーションと行動ボタンを戻す。
      supporting.forEach(element => fade(element, cursor + 180, 550));
      const finalStart = cursor + 900;
      if (header) fade(header, finalStart, 650);
      if (button) fade(button, finalStart + 100, 650);
      if (carouselControls) fade(carouselControls, finalStart + 100, 650);
      root.dataset.copyEnd = String(cursor);
      root.dataset.finalStart = String(finalStart);
      root.dataset.totalDuration = String(finalStart + 750);
      timer = setTimeout(() => {
        restoreText();
        inertTargets.forEach((element, index) => { element.inert = originalInert[index]; });
        report("complete");
      }, finalStart + 750);
    };
    const onMessage = (event: MessageEvent) => {
      if (!preview || event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === "top-play") play();
      if (event.data?.type === "top-stop") { cancel(); report("complete"); }
    };
    window.addEventListener("message", onMessage);
    const onPreference = () => { if (reduce.matches) { cancel(); report("reduced"); } };
    reduce.addEventListener("change", onPreference);
    // アンカー・履歴の復帰位置や、ユーザー自身のスクロールを優先する。
    const shouldSkip = () => !preview && (Boolean(window.location.hash) || window.scrollY > 32);
    const onScroll = () => {
      if (shouldSkip() && root.dataset.playback !== "complete") { cancel(); report("complete"); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    async function start() {
      if (shouldSkip()) { cancel(); report("complete"); return; }
      // 本文とは無関係な画像のloadを待たず、フォントも長時間待たない。
      const fontsReady = await Promise.race([
        document.fonts.ready.then(() => true),
        new Promise<boolean>(resolve => { fontTimer = setTimeout(() => resolve(false), 1800); }),
      ]);
      window.clearTimeout(fontTimer);
      if (!active || !root) return;
      if (!fontsReady || shouldSkip() || (!preview && lines[0] && getComputedStyle(lines[0]).opacity === "1")) {
        cancel(); report(reduce.matches ? "reduced" : "complete"); return;
      }
      if (preview) window.scrollTo({ top: 0, behavior: "instant" });
      if (reduce.matches) root.dataset.topInitial = "ready";
      if (preview) window.parent.postMessage({ type: "top-ready", variant }, window.location.origin);
      if (!preview || window.parent === window) {
        if (preview && new URLSearchParams(window.location.search).get("autoplay") === "0") { cancel(); report("complete"); }
        else play();
      }
    }
    void start();
    return () => { active = false; cancel(); window.removeEventListener("message", onMessage); reduce.removeEventListener("change", onPreference); window.removeEventListener("scroll", onScroll); window.clearTimeout(fontTimer); if (preview) window.history.scrollRestoration = originalScrollRestoration; };
  }, [variant, preview]);
  return null;
}
