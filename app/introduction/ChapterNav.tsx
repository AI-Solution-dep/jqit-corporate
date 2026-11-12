"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./introduction.module.css";

const chapters = [
  { id: "projects", label: "開発実績", short: "実績", lead: "業務の課題を、動く仕組みに。" },
  { id: "team", label: "開発体制", short: "チーム", lead: "4つの専門領域が、ひとつのチームに。" },
  { id: "process", label: "進め方", short: "進め方", lead: "小さく確かめ、毎週の対話で改善する。" },
  { id: "contacts", label: "担当者・連絡先", short: "連絡先", lead: "ご相談から、伴走を始めます。" },
] as const;

/** 読んでいる章を示す。リンクと本文はJavaScriptなしでも利用できる。 */
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
      setActive(previous => previous === current ? previous : current);
      const rect = bounds[current];
      const progress = rect ? Math.max(0, Math.min(1, (line - rect.top) / rect.height)) : 0;
      const atEnd = (document.scrollingElement?.scrollHeight ?? document.documentElement.scrollHeight) - (window.scrollY + height) <= 2;
      nav.style.setProperty("--chapter-progress", String(atEnd ? 1 : (current + progress) / chapters.length));
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
    <aside ref={ref} className={styles.chapterNav} aria-label="読んでいる章">
      <div className={styles.chapterCurrent}>
        <p className={styles.chapterEyebrow}>いま読んでいる項目</p>
        <p key={active} className={styles.chapterTitle}>{chapters[active].label}</p>
        <p className={styles.chapterLead}>{chapters[active].lead}</p>
      </div>
      <nav id="introduction-chapters" className={styles.chapterLinks} aria-label="紹介ページの目次">
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`} aria-current={active === index ? "location" : undefined}>
                <span className={styles.chapterPoint} aria-hidden="true" />
                <span>{chapter.label}</span>
                <span className={styles.chapterShort}>{chapter.short}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.chapterProgress} aria-hidden="true"><span /></div>
      <p className={styles.chapterHint}>スクロールして読み進める <span aria-hidden="true">↓</span></p>
    </aside>
  );
}
