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
          <div className="border-t border-line">
            {items.map((item, index) => (
              <FadeIn
                key={item.question}
                className="grid grid-cols-1 gap-3 border-b border-line py-7 min-[800px]:grid-cols-[minmax(280px,0.8fr)_1.2fr] min-[800px]:gap-12 min-[800px]:py-8"
              >
                <h3 className="palt flex gap-3 text-[16px] font-bold leading-[1.8] text-ink">
                  <span className="font-mono text-[12px] text-brand">
                    Q{String(index + 1).padStart(2, "0")}
                  </span>
                  {item.question}
                </h3>
                <p className="text-[14px] leading-[2.05] text-body">{item.answer}</p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
