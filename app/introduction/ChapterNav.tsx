"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./introduction.module.css";

const chapters = [
  { id: "projects", label: "開発実績" },
  { id: "team", label: "開発体制" },
  { id: "process", label: "進め方" },
  { id: "contacts", label: "担当者・連絡先" },
] as const;

/** 読む位置に追従する円形ナビ。本文幅を確保する専用カラムは作らない。 */
export function ChapterNav() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const sections = chapters.map(({ id }) => document.getElementById(id));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = window.innerHeight;
      const bounds = sections.map(section => section?.getBoundingClientRect());
      const line = Math.max(160, height * .35);
      let current = 0;
      bounds.forEach((rect, index) => { if (rect && rect.top <= line) current = index; });
      const reading = !!bounds[0] && bounds[0].top < height * .85 && !!bounds.at(-1) && bounds.at(-1)!.bottom > 100;
      nav.dataset.visible = String(reading);
      setActive(previous => previous === current ? previous : current);
      sections.forEach((section, index) => {
        const box = bounds[index];
        if (!section || !box) return;
        const offset = reduced.matches ? 0 : Math.max(-40, Math.min(40, (height / 2 - box.top - box.height / 2) * .06));
        section.style.setProperty("--intro-flow-y", `${offset}px`);
        section.style.setProperty("--intro-flow-opacity", String(reduced.matches ? 1 : Math.max(.2, Math.min(1, box.bottom / height))));
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    sections.forEach(section => { if (section) observer.observe(section); });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      sections.forEach(section => {
        section?.style.removeProperty("--intro-flow-y");
        section?.style.removeProperty("--intro-flow-opacity");
      });
    };
  }, []);

  return (
    <aside ref={ref} className={styles.chapterNav} aria-label="読んでいる章" data-visible="false" style={{ "--chapter-angle": `${-24 + active * 16}deg` } as CSSProperties}>
      <div className={styles.chapterOrbit} aria-hidden="true">
        <svg viewBox="0 0 320 320" fill="none">
          <circle cx="160" cy="160" r="146" />
          {[0, 1, 2, 3].map(index => <circle key={index} cx="306" cy="160" r="4" transform={`rotate(${-24 + index * 16} 160 160)`} />)}
          <circle cx="306" cy="160" r="8" className={styles.orbitActive} />
        </svg>
      </div>
      <details className={styles.chapterMenu}>
        <summary aria-label={`現在は${chapters[active].label}。項目一覧を開く`}>
          <span key={`icon-${active}`} className={styles.chapterSymbol} aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {active === 0 && <><path d="m16 14-10 10 10 10m16-20 10 10-10 10M28 9l-8 30" /></>}
              {active === 1 && <><circle cx="24" cy="14" r="6" /><path d="M13 38v-5a11 11 0 0 1 22 0v5M7 12a5 5 0 0 0 0 10m34-10a5 5 0 0 1 0 10M4 36v-6a7 7 0 0 1 6-7m34 13v-6a7 7 0 0 0-6-7" /></>}
              {active === 2 && <><path d="M35 13A16 16 0 0 0 8 23m0-10v10h10M13 35a16 16 0 0 0 27-10m0 10V25H30" /><path d="m19 24 4 4 7-8" /></>}
              {active === 3 && <><path d="M7 9h34v25H25L14 42v-8H7zM15 18h18M15 25h12" /></>}
            </svg>
          </span>
          <span key={`title-${active}`} className={styles.chapterCurrent}>
            <span className={styles.chapterEyebrow}>いま読んでいる項目</span>
            <span className={styles.chapterTitle}>{chapters[active].label}</span>
            <span className={styles.chapterMenuHint}>目次を開く <span aria-hidden="true">＋</span></span>
          </span>
        </summary>
        <nav id="introduction-chapters" className={styles.chapterLinks} aria-label="紹介ページの目次">
          <ol>
            {chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <a href={`#${chapter.id}`} aria-current={active === index ? "location" : undefined} onClick={event => { event.currentTarget.closest("details")?.removeAttribute("open"); }}>
                  <span className={styles.chapterPoint} aria-hidden="true" />{chapter.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>
      <div className={styles.chapterStops} aria-label={`全4項目中、${active + 1}番目`}>
        {chapters.map((chapter, index) => <span key={chapter.id} data-active={active === index ? "true" : undefined} aria-hidden="true"><i />{chapter.label}</span>)}
      </div>
    </aside>
  );
}
