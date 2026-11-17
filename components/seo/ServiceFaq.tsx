import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHead } from "@/components/ui/SectionHead";

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

type ServiceFaqProps = {
  items: readonly ServiceFaqItem[];
};

const FIRST_COUNT = 6;

/** 質問1行。Q・質問文・＋印は1行目の高さで中央をそろえる。ホバーは行の決まり（左の線→四辺の枠）に合わせる */
function FaqRow({ item }: { item: ServiceFaqItem }) {
  return (
    <FadeIn className="brand-line-row faq-row border-b border-line">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-start gap-3 py-6 min-[800px]:py-7 [&::-webkit-details-marker]:hidden">
          <span className="font-mono text-[12px] leading-[28.8px] text-warm-ink">Q</span>
          <h3 className="palt flex-1 text-[16px] font-bold leading-[1.8] text-ink transition-colors group-hover:text-warm-ink">
            {item.question}
          </h3>
          <span aria-hidden className="relative flex h-[28.8px] w-3 shrink-0 items-center">
            <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-ink transition-colors group-hover:bg-warm" />
            <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-ink transition-transform duration-300 group-open:rotate-90 group-open:bg-warm" />
          </span>
        </summary>
        <p className="pb-7 pl-[26px] pr-6 text-[14px] leading-[2.05] text-body min-[800px]:pb-8">
          {item.answer}
        </p>
      </details>
    </FadeIn>
  );
}

export function ServiceFaq({ items }: ServiceFaqProps) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } satisfies Record<string, unknown>;

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <section className="border-t border-line bg-paper py-20 min-[720px]:py-[96px]">
        <Container>
          <SectionHead
            kicker="FAQ"
            title="よくあるご質問"
            lead="ご相談前によくいただくご質問へ、簡潔にお答えします。"
            className="mb-12"
          />
          {/*
            開閉式（既定は閉）。details/summary を使うため JavaScript なしで動作し、
            回答本文は閉じていても HTML に存在する（構造化データ・検索の評価に影響しない）。
          */}
          {/* 最初の6問だけ出し、残りは「ほかのご質問」を開くと出す（JavaScript なしで動く。全問 HTML にあるので検索・構造化データの評価は変わらない） */}
          <div className="border-t border-line">
            {items.slice(0, FIRST_COUNT).map((item) => (
              <FaqRow key={item.question} item={item} />
            ))}
          </div>
          {items.length > FIRST_COUNT && (
            <details className="faq-more group/more">
              <summary className="faq-more-toggle">
                <span className="group-open/more:hidden">ほかのご質問（{items.length - FIRST_COUNT}件）を見る</span>
                <span className="hidden group-open/more:inline">閉じる</span>
                <span aria-hidden className="faq-more-icon" />
              </summary>
              <div>
                {items.slice(FIRST_COUNT).map((item) => (
                  <FaqRow key={item.question} item={item} />
                ))}
              </div>
            </details>
          )}
        </Container>
      </section>
    </>
  );
}
