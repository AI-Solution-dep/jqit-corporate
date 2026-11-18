"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";

/**
 * TOP の事業欄。
 * 左（スマホは上端）に「IT」「AI」と、その間の「実装・運用」の円を線でつないだ図を固定し、
 * 右に2つの事業を縦に並べる。スクロールで読んでいる事業に合わせて図の選択が切り替わり、円を押すとその事業へ移る。
 * 同じ大きさの箱を左右に並べる作りと、同じ語を何度も出す作りはやめた（2026-11-18 デザインレビュー）。
 */
const businesses = [
  {
    key: "it",
    en: "IT Solutions",
    short: "IT",
    title: "ITソリューション事業",
    tags: ["開発", "インフラ", "QA"],
    body: "システム構築の要件定義から運用保守まで。業務システム開発、インフラ構築、QA・第三者検証をワンストップで提供します。",
    image: "/business-it-whiteboard.webp",
    alt: "ホワイトボードにシステム構成を描き足すエンジニアの手元",
    href: "/business/it-solutions",
    capabilities: [
      { head: "システム＆アプリ開発", note: "要件定義から運用保守まで、SES・受託どちらでも", href: "/business/it-solutions#development" },
      { head: "インフラ構築・運用", note: "クラウドの設計から監視まで", href: "/business/it-solutions#infrastructure" },
      { head: "QA・第三者検証", note: "ISTQB® Gold パートナーの検証力", href: "/business/it-solutions#qa" },
    ],
  },
  {
    key: "ai",
    en: "AI Solutions",
    short: "AI",
    title: "AIソリューション事業",
    tags: ["生成AI", "RAG", "AIエージェント"],
    body: "生成AIの導入支援からAIシステム開発まで。大規模言語モデルを中心に、企業のAI活用を実務で動く形にします。",
    image: "/business-ai-review.webp",
    alt: "紙のフロー図とノートPCを見ながらAIの業務フローを確認する2人",
    href: "/business/ai-solutions",
    capabilities: [
      { head: "AIエージェント開発・RAG構築", note: "社内のデータで答えるAIを開発", href: "/business/ai-solutions#ai-agent" },
      { head: "AI導入支援・内製化支援", note: "現場で使われるまで伴走", href: "/business/ai-solutions#ai-consulting" },
      { head: "自社プロダクト NOVA", note: "SES営業のためのAIマッチング", href: "/business/ai-solutions#ai-product" },
    ],
  },
] as const;

export function BusinessSection() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // この欄を表示している間は、背景の図形を薄くする（本文に重なって読みにくくならないよう）
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "-30% 0px -30% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    if (inView) main.dataset.backdropDim = "";
    else delete main.dataset.backdropDim;
    return () => {
      delete main.dataset.backdropDim;
    };
  }, [inView]);

  // 画面の中ほどにある事業を「選択中」にする
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = refs.current.indexOf(entry.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => {
    setActive(i);
    // 動きを減らす設定のときは JS 側でも滑らかなスクロールにしない（CSS の scroll-behavior より JS の指定が勝つため）
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    refs.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <section ref={sectionRef} id="business" className="bg-paper pb-24 pt-10 min-[1024px]:pb-40 min-[1024px]:pt-16">
      <Container>
        <FadeIn className="biz-head-sp mb-8">
          <Kicker className="mb-4">Business</Kicker>
          <h2 className="palt text-[28px] font-bold leading-[1.4] tracking-[-0.02em] text-ink">
            ITとAI、
            <br />
            <span className="text-brand">ふたつの力</span>で課題を解く。
          </h2>
          <p className="mt-4 text-[14.5px] leading-[2] text-body">
            つくる力と、AIを使いこなす力。両方を持つチームが、実装と運用まで届けます。
          </p>
        </FadeIn>
        <div className="biz-layout">
          {/* 左（スマホは上端）に固定する図と見出し */}
          <div className="biz-aside">
            <FadeIn className="biz-head">
              <Kicker className="mb-4">Business</Kicker>
              <h2 className="palt text-[28px] font-bold leading-[1.4] tracking-[-0.02em] text-ink md:text-[40px]">
                ITとAI、<span className="text-brand">ふたつの力</span>で課題を解く。
              </h2>
              <p className="mt-5 text-[15px] leading-[2] text-body">
                つくる力と、AIを使いこなす力。両方を持つチームが、実装と運用まで届けます。
              </p>
            </FadeIn>
            <div className="biz-map" role="group" aria-label="事業を選ぶ">
              <svg className="biz-map-lines" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
                <line x1="16" y1="20" x2="50" y2="20" data-active={active === 0 || undefined} />
                <line x1="84" y1="20" x2="50" y2="20" data-active={active === 1 || undefined} />
              </svg>
              {businesses.map((b, i) => (
                <button
                  key={b.key}
                  type="button"
                  className={`biz-map-node biz-map-node--${b.key}`}
                  aria-pressed={active === i}
                  onClick={() => jump(i)}
                >
                  <span className="biz-map-short">{b.short}</span>
                  <span className="biz-map-en">{b.en}</span>
                </button>
              ))}
              <span className="biz-map-core palt" aria-hidden>
                {/* 「実装・」で折ると1行目だけ長くなり右に寄って見えるので、点を入れず2文字ずつ2行にする */}
                <span className="biz-map-core-text">
                  実装
                  <br />
                  運用
                </span>
              </span>
              <span className="biz-map-core-label" aria-hidden>
                実装・運用
              </span>
            </div>
            {/* 選んでいる事業の名前と分類（押せる図であることも伝える） */}
            <p className="biz-map-caption">
              <span key={active} className="biz-map-caption-text">
                {businesses[active].title} — {businesses[active].tags.join("・")}
              </span>
            </p>
          </div>

          {/* 右（スマホは下）に2つの事業 */}
          <div className="biz-list">
            {businesses.map((b, i) => (
              <article
                key={b.key}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="biz-item"
                data-active={active === i || undefined}
              >
                <div className={`biz-item-photo ${i === 0 ? "photo-curve" : "biz-photo-curve-bl"}`}>
                  <Image
                    src={b.image}
                    alt={b.alt}
                    width={1536}
                    height={1136}
                    sizes="(min-width: 1024px) 680px, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* 事業の分類は名前の上に1回だけ出す（タグの箱は並べない） */}
                <p className="mt-8 text-[12px] font-bold tracking-[0.12em] text-warm-ink">{b.tags.join(" / ")}</p>
                <h3 className="palt mt-2 text-[24px] font-bold tracking-[-0.02em] text-ink min-[720px]:text-[32px]">
                  {b.title}
                </h3>
                <p className="mt-4 max-w-[560px] text-[15px] leading-[2.05] text-body">{b.body}</p>
                <ul className="biz-caps">
                  {b.capabilities.map((c) => (
                    <li key={c.head}>
                      <Link href={c.href} className="biz-cap">
                        <span className="biz-cap-head palt">{c.head}</span>
                        <span className="biz-cap-note">{c.note}</span>
                        <span aria-hidden className="biz-cap-arrow">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={b.href}
                  className="group mt-8 inline-flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.12em] text-ink transition-colors hover:text-warm-ink"
                >
                  {b.title}を詳しく見る
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
