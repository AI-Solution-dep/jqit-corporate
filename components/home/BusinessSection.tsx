"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";

/**
 * TOP の事業欄。
 * 左に見出しと説明文を固定し（幅 1024px 以上）、右に2つの事業を縦に並べる。スマホは見出しを上に置くだけ。
 * 同じ大きさの箱を左右に並べる作りと、同じ語を何度も出す作りはやめた（2026-11-18 デザインレビュー）。
 * 左にあった「IT」「AI」「実装・運用」の円の図は、押せることも意味も伝わらなかったので外した（2026-11-27）。
 */
const businesses = [
  {
    key: "it",
    title: "ITソリューション事業",
    tags: ["開発", "インフラ", "QA"],
    // 行ごとに分けて持つ（幅の広い画面では、この切れ目で改行する。1文目は1行に収まらないので読点でも分ける）
    body: ["大規模なシステムから小規模なものまで、", "品質とスケジュールの管理を徹底して開発します。", "インフラ構築、QA・第三者検証まで、ワンストップで対応します。"],
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
    title: "AIソリューション事業",
    tags: ["生成AI", "RAG", "AIエージェント"],
    body: ["生成AIの導入支援からAIシステム開発まで。", "大規模言語モデルを中心に、企業のAI活用を実務で動く形にします。"],
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
            {/* 幅 520px 以上は文の切れ目で二行にする。それより狭いと1行目が収まらないので流し込みにする */}
            システムをつくるIT事業と、AIを業務に活かすAI事業。
            <br className="hidden min-[520px]:inline" />
            開発から運用まで、2つの事業でお応えします。
          </p>
        </FadeIn>
        <div className="biz-layout">
          {/* 左に固定する見出しと説明文（幅 1024px 以上） */}
          <div className="biz-aside">
            <FadeIn className="biz-head">
              <Kicker className="mb-4">Business</Kicker>
              <h2 className="palt text-[28px] font-bold leading-[1.4] tracking-[-0.02em] text-ink md:text-[40px]">
                ITとAI、<span className="text-brand">ふたつの力</span>で課題を解く。
              </h2>
              <p className="mt-5 text-[15px] leading-[2] text-body">
                {/* 幅 1100px 以上は文の切れ目で二行にする。それより狭いと1行目が列に収まらないので流し込みにする */}
                システムをつくるIT事業と、AIを業務に活かすAI事業。
                <br className="hidden min-[1100px]:inline" />
                開発から運用まで、2つの事業でお応えします。
              </p>
            </FadeIn>
          </div>

          {/* 右（スマホは下）に2つの事業 */}
          <div className="biz-list">
            {businesses.map((b, i) => (
              <article key={b.key} className="biz-item">
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
                <p className="mt-4 max-w-[600px] text-[15px] leading-[2.05] text-body">
                  {b.body.map((line, li) => (
                    <Fragment key={line}>
                      {/* 幅 720px 以上は決めた切れ目で改行する。それより狭いと1行に収まらないので流し込みにする */}
                      {li > 0 && <br className="hidden min-[720px]:inline" />}
                      {line}
                    </Fragment>
                  ))}
                </p>
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
