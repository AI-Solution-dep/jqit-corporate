import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { DisplayText } from "@/components/ui/DisplayText";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";
import { siteConfig } from "@/lib/site-config";

const services = [
  {
    id: "nova",
    label: "Product",
    name: "NOVA",
    heading: "SES営業を変える、NOVA",
    description:
      "案件・人材メールをAIが構造化し、2段階マッチングで候補と判断理由を提示。契約終了アラートによる先回り営業まで、メール1通が提案になるまでを支えるSES向けAIマッチングシステムです。",
    features: ["AI 2段階マッチング", "メール自動取込", "契約終了アラート"],
    href: siteConfig.links.nova,
    cta: "NOVA 製品サイトへ",
  },
  {
    id: "ai-support",
    label: "AI Automation",
    name: "AI導入伴走支援",
    heading: "手作業を減らす、AI導入伴走支援",
    description:
      "いま使っている業務アプリを活かしながら、現場で動くAIエージェントの導入まで3か月で伴走します。",
    features: ["業務の棚卸しから設計", "既存アプリを活用", "運用と内製化まで支援"],
    href: siteConfig.links.aiSupport,
    cta: "AI導入伴走支援を見る",
  },
] as const;

export function ServiceSection() {
  return (
    <section
      id="service"
      className="overflow-hidden border-t border-line bg-cream py-20 min-[720px]:py-24"
    >
      <Container>
        <FadeIn>
          <DisplayText className="-ml-1 mb-8">SERVICES</DisplayText>
          <Kicker className="mb-4">Services</Kicker>
          <h2 className="palt text-[28px] font-bold leading-[1.4] tracking-[-0.02em] text-ink md:text-[38px]">
            JQITの<span className="text-brand">サービス</span>
          </h2>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[2] text-body">
            業務に寄り添うプロダクトと、現場への導入まで伴走する支援サービスで、企業の変革を前に進めます。
          </p>
        </FadeIn>

        {/* 事業欄（写真と文章の左右交互）と見分けられるよう、サービスは2つを横に並べて見比べる型にする。
            箱には入れず、間を縦の罫線で区切る。画像は上、文章は下 */}
        <div className="service-pair mt-14 min-[1024px]:mt-16">
          {services.map((service) => (
            <FadeIn key={service.id} className="service-pair-item">
              <div className={`service-pair-media photo-curve ${service.id === "nova" ? "service-pair-media--product" : ""}`}>
                {service.id === "nova" ? (
                  <Image
                    src="/nova-product-2026-08c.png"
                    alt="NOVA 管理画面 — AIマッチングアシスタントと案件一覧"
                    width={748}
                    height={438}
                    className="h-full w-full object-contain p-6 min-[720px]:p-10"
                  />
                ) : (
                  <Image
                    src="/business-ai.png"
                    alt="AI導入について画面を見ながら相談する担当者"
                    width={1536}
                    height={1365}
                    className="h-full w-full object-cover object-center"
                  />
                )}
              </div>

              <div className="mt-8">
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-warm-ink">
                  {service.label} — {service.name}
                </p>
                <h3 className="palt mt-3 text-[22px] font-bold leading-[1.5] text-ink min-[720px]:text-[26px]">
                  {service.heading}
                </h3>
                <p className="mt-4 text-[14.5px] leading-[2] text-body">{service.description}</p>
                <ul className="nova-features mt-7">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-[14px] font-bold leading-[1.8] text-ink">
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-9">
                  <a
                    href={service.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-button bg-ink px-7 py-[14px] text-sm font-bold tracking-[0.02em] text-white transition-colors hover:bg-warm-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand min-[600px]:w-fit"
                  >
                    <span>{service.cta}</span>
                    <span
                      aria-hidden
                      className="font-mono transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
