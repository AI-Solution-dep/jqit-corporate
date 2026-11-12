"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./section-handoff.css";

type Chapter = { id: string; label: string };
type Scene = { section: HTMLElement; heading: HTMLElement; opacity: string; planes: HTMLElement[] };

/** 実見出しを上部へ引き継ぐ。背景の面だけを別の速度で動かす。 */
export function SectionHandoff({ chapters, rootSelector, headerOffset = 72, mobileHeaderOffset = headerOffset }: {
  chapters: readonly Chapter[];
  rootSelector: string;
  headerOffset?: number;
  mobileHeaderOffset?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nav = ref.current;
    const target = targetRef.current;
    const root = document.querySelector<HTMLElement>(rootSelector);
    if (!nav || !target || !root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scenes: Scene[] = [];
    chapters.forEach(({ id }, index) => {
      const section = root.querySelector<HTMLElement>(`#${id}`);
      const heading = section?.querySelector<HTMLElement>("h2");
      if (!section || !heading) return;
      section.dataset.readingScene = String(index % 3);
      const planes = ["back", "front"].map(layer => {
        const plane = document.createElement("div");
        plane.className = `reading-plane reading-plane--${layer}`;
        plane.setAttribute("aria-hidden", "true");
        section.prepend(plane);
        return plane;
      });
      scenes.push({ section, heading, opacity: heading.style.opacity, planes });
    });
    if (scenes.length !== chapters.length) {
      scenes.forEach(({ section, planes }) => { delete section.dataset.readingScene; planes.forEach(plane => plane.remove()); });
      return;
    }
    root.dataset.readingMotion = "on";
    let frame = 0;
    let current = -1;
    let clone: HTMLElement | null = null;
    let rebuild = true;
    let alive = true;
    const restore = () => scenes.forEach(scene => { scene.heading.style.opacity = scene.opacity; });
    const paint = () => {
      frame = 0;
      const height = window.innerHeight;
      const mobile = window.innerWidth < 760;
      const dock = target.getBoundingClientRect();
      const boxes = scenes.map(({ section, heading }) => ({ section: section.getBoundingClientRect(), heading: heading.getBoundingClientRect() }));
      const distance = mobile ? 88 : 140;
      let next = 0;
      // 現在章は本文の位置で判定し、見出しが帯へ入る時機とは分離する。
      const readingLine = Math.max(nav.getBoundingClientRect().bottom + 72, height * .4);
      boxes.forEach(({ section }, index) => { if (section.top <= readingLine) next = index; });
      if (next !== current || rebuild) {
        restore();
        clone?.remove();
        current = next;
        rebuild = false;
        const source = scenes[current].heading;
        const font = getComputedStyle(source);
        clone = source.cloneNode(true) as HTMLElement;
        clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach(element => element.removeAttribute("id"));
        clone.className = "reading-handoff-flying";
        clone.setAttribute("aria-hidden", "true");
        // spanの改行グループも含め、本文と同じ文字組みで受け渡す。
        const descendants = Array.from(source.querySelectorAll<HTMLElement>("*"));
        Array.from(clone.querySelectorAll<HTMLElement>("*")).forEach((element, index) => {
          const style = getComputedStyle(descendants[index]);
          Object.assign(element.style, { display: style.display, whiteSpace: style.whiteSpace, fontFamily: style.fontFamily, fontWeight: style.fontWeight, fontSize: style.fontSize, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, color: style.color });
        });
        Object.assign(clone.style, {
          fontFamily: font.fontFamily, fontSize: font.fontSize, fontWeight: font.fontWeight,
          lineHeight: font.lineHeight, letterSpacing: font.letterSpacing, color: font.color,
          fontFeatureSettings: font.fontFeatureSettings, fontKerning: font.fontKerning,
        });
        nav.appendChild(clone);
        setActive(previous => previous === current ? previous : current);
      }
      const source = boxes[current].heading;
      const raw = Math.max(0, Math.min(1, (dock.top + distance - source.top) / distance));
      const progress = reduced.matches ? (source.top <= dock.top ? 1 : 0) : raw * raw * (3 - 2 * raw);
      const fontSize = parseFloat(getComputedStyle(scenes[current].heading).fontSize);
      const scale = Math.min(1, dock.width / Math.max(1, source.width), dock.height / Math.max(1, source.height), (mobile ? 20 : 25) / fontSize);
      const visible = progress > 0;
      nav.dataset.docked = String(progress >= 1);
      nav.dataset.transferring = String(visible);
      target.style.setProperty("--handoff-fallback", visible ? "0" : "1");
      scenes[current].heading.style.opacity = visible ? "0" : scenes[current].opacity;
      if (clone) {
        Object.assign(clone.style, {
          visibility: visible ? "visible" : "hidden", width: `${source.width}px`, height: `${source.height}px`,
          transform: `translate3d(${source.left + (dock.left - source.left) * progress}px,${source.top + (dock.top - source.top) * progress}px,0) scale(${1 + (scale - 1) * progress})`,
        });
      }
      const settled = boxes.at(-1)!.section.bottom <= nav.getBoundingClientRect().bottom;
      nav.dataset.finished = String(settled);
      if (clone && settled) clone.style.visibility = "hidden";
      boxes.forEach(({ section }, index) => {
        const p = Math.max(0, Math.min(1, (height - section.top) / (height + section.height)));
        const direction = index % 2 ? -1 : 1;
        const strength = reduced.matches ? 0 : mobile ? .32 : 1;
        const element = scenes[index].section;
        element.style.setProperty("--reading-back-x", `${(p - .5) * 200 * direction * strength}px`);
        element.style.setProperty("--reading-back-y", `${(p - .5) * 130 * strength}px`);
        element.style.setProperty("--reading-front-x", `${(p - .5) * -110 * direction * strength}px`);
        element.style.setProperty("--reading-front-y", `${(p - .5) * -180 * strength}px`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const resize = () => { rebuild = true; schedule(); };
    const observer = new ResizeObserver(resize);
    scenes.forEach(({ section, heading }) => { observer.observe(section); observer.observe(heading); });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    reduced.addEventListener("change", schedule);
    document.fonts.ready.then(() => { if (alive) resize(); });
    schedule();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      reduced.removeEventListener("change", schedule);
      restore();
      clone?.remove();
      delete root.dataset.readingMotion;
      scenes.forEach(({ section, planes }) => {
        delete section.dataset.readingScene;
        planes.forEach(plane => plane.remove());
        ["--reading-back-x", "--reading-back-y", "--reading-front-x", "--reading-front-y"].forEach(property => section.style.removeProperty(property));
      });
    };
  }, [chapters, rootSelector]);

  return (
    <aside ref={ref} className="reading-handoff" aria-label={`現在の項目：${chapters[active].label}`} style={{ "--handoff-header": `${headerOffset}px`, "--handoff-mobile-header": `${mobileHeaderOffset}px` } as CSSProperties}>
      <div className="reading-handoff-inner">
        <div className="reading-handoff-current">
          <p className="reading-handoff-caption">{chapters[active].label}</p>
          <div ref={targetRef} className="reading-handoff-target"><span>{chapters[active].label}</span></div>
        </div>
        <details className="reading-handoff-menu">
          <summary>目次 <span aria-hidden="true">＋</span></summary>
          <nav aria-label="ページ内の目次"><ol>{chapters.map((chapter, index) => <li key={chapter.id}><a href={`#${chapter.id}`} aria-current={active === index ? "location" : undefined} onClick={event => event.currentTarget.closest("details")?.removeAttribute("open")}>{chapter.label}</a></li>)}</ol></nav>
        </details>
      </div>
    </aside>
  );
}
