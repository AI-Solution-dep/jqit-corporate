import Image from "next/image";
import { Container } from "@/components/ui/Container";
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
          <Kicker className="mb-4">Services</Kicker>
          <h2 className="palt text-[28px] font-bold leading-[1.4] tracking-[-0.02em] text-ink md:text-[38px]">
            JQITの<span className="text-brand">サービス</span>
          </h2>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[2] text-body">
            業務に寄り添うプロダクトと、現場への導入まで伴走する支援サービスで、企業の変革を前に進めます。
          </p>
        </FadeIn>

        {/* 写真を横幅いっぱいに大きく入れ、2つのサービスを縦に並べる。写真の下に文章（PC は見出し・説明と、特徴・ボタンの2列） */}
        <div className="service-stack mt-14 min-[1024px]:mt-16">
          {services.map((service, index) => (
            <FadeIn key={service.id} className="service-stack-item">
              <div className={`service-stack-media ${index % 2 === 1 ? "photo-curve--reverse" : "photo-curve"} ${service.id === "nova" ? "service-stack-media--product" : ""}`}>
                {service.id === "nova" ? (
                  <Image
                    src="/nova-product-logo.png"
                    alt="NOVA 管理画面 — AIマッチングアシスタントと案件一覧"
                    width={748}
                    height={438}
                    sizes="(min-width: 1024px) 900px, 90vw"
                    className="h-full w-full object-contain p-6 min-[720px]:p-12"
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

              <div className="service-stack-text">
                <div>
                {service.id === "nova" ? (
                  /* 製品はロゴ（アイコン＋製品名）で示す */
                  <p className="flex items-center gap-3">
                    <Image src="/nova-icon.png" alt="" width={54} height={43} className="h-7 w-auto mix-blend-multiply" />
                    <span className="text-[22px] font-black tracking-[0.18em] text-ink">NOVA</span>
                    <span className="ml-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {service.label}
                    </span>
                  </p>
                ) : (
                  <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-warm-ink">
                    {service.label} — {service.name}
                  </p>
                )}
                <h3 className="palt mt-3 text-[22px] font-bold leading-[1.5] text-ink min-[720px]:text-[26px]">
                  {service.heading}
                </h3>
                <p className="mt-4 text-[15px] leading-[2.05] text-body">{service.description}</p>
                </div>
                <div>
                <ul className="nova-features">
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
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-button bg-brand px-7 py-[14px] text-sm font-bold tracking-[0.02em] text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand min-[600px]:w-fit"
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
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
