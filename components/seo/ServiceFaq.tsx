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
          <div className="border-t border-line">
            {items.map((item, index) => (
              <FadeIn key={item.question} className="border-b border-line">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start gap-3 py-6 transition-colors hover:text-brand min-[800px]:py-7 [&::-webkit-details-marker]:hidden">
                    <span className="mt-[3px] font-mono text-[12px] text-brand">
                      Q{String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="palt flex-1 text-[16px] font-bold leading-[1.8] text-ink transition-colors group-hover:text-brand">
                      {item.question}
                    </h3>
                    <span
                      aria-hidden
                      className="relative mt-3 h-3 w-3 shrink-0 min-[800px]:mt-4"
                    >
                      <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-ink transition-colors group-hover:bg-brand" />
                      <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-ink transition-transform duration-300 group-open:rotate-90 group-open:bg-brand" />
                    </span>
                  </summary>
                  <p className="pb-7 pl-[38px] pr-6 text-[14px] leading-[2.05] text-body min-[800px]:pb-8">
                    {item.answer}
                  </p>
                </details>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
