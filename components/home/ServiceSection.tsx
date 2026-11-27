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
    // 製品サイト（nova-ai.jp）の今の説明に合わせる。契約終了アラートは 2026-07-31 に製品から外れたので書かない。
    // 説明は言葉のまとまりごとに分けて持つ（Phrases が、まとまりの途中では折り返さないように描く）
    description: [
      "届いた案件・人材メールを",
      "AIが読み取って整理し、",
      "合う候補を根拠つきで提示。",
      "提案メールの下書きまで、",
      "メール1通が提案になるまでを支える",
      "SES向けAIマッチングシステムです。",
    ],
    features: ["根拠つきAIマッチング", "メール自動取込", "提案文の下書き"],
    href: siteConfig.links.nova,
    cta: "NOVA 製品サイトへ",
  },
  {
    id: "ai-support",
    label: "AI Automation",
    name: "AI導入伴走支援",
    heading: "手作業を減らす、AI導入伴走支援",
    description: ["いま使っている業務アプリを", "活かしながら、", "現場で動くAIエージェントの導入まで", "3か月で伴走します。"],
    features: ["業務の棚卸しから設計", "既存アプリを活用", "運用と内製化まで支援"],
    href: siteConfig.links.aiSupport,
    cta: "AI導入伴走支援を見る",
  },
] as const;

/** 言葉のまとまりの途中で折り返さない文章。「ます。」だけ、語の途中だけが次の行に落ちるのを防ぐ */
function Phrases({ parts }: { parts: readonly string[] }) {
  return parts.map((part) => (
    <span key={part} className="inline-block">
      {part}
    </span>
  ));
}

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
          {/* 46文字。680px だと最後の「ます。」だけが次の行に落ちるので、1行に収まる幅にする。狭い画面では言葉のまとまりで折り返す */}
          <p className="mt-4 max-w-[720px] text-[15px] leading-[2] text-body">
            <Phrases parts={["業務に寄り添うプロダクトと、", "現場への導入まで伴走する", "支援サービスで、", "企業の変革を前に進めます。"]} />
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
                <p className="mt-4 text-[15px] leading-[2.05] text-body">
                  <Phrases parts={service.description} />
                </p>
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
