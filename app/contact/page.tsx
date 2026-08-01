import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";
import { createPageMetadata, createWebPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const pageDescription =
  "株式会社JQITへのお問い合わせ。IT・AIソリューション、採用、協業のご相談を受け付けています。担当者より2〜3営業日以内にご連絡します。";

export const metadata = createPageMetadata({
  title: "お問い合わせ",
  description: pageDescription,
  path: "/contact",
});

const contactJsonLd = createWebPageJsonLd({
  type: "ContactPage",
  name: "お問い合わせ｜株式会社JQIT",
  description: pageDescription,
  path: "/contact",
  breadcrumbs: [
    { name: "ホーム", path: "/" },
    { name: "お問い合わせ", path: "/contact" },
  ],
});

const directInfos = [
  { label: "Tel", value: siteConfig.tel, en: true },
  { label: "Fax", value: siteConfig.fax, en: true },
  { label: "Address", value: siteConfig.addressShort, en: false },
  { label: "Hours", value: siteConfig.businessHours, en: false },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd} />
      <PageHeader title="お問い合わせ" en="Contact" />
      <section className="bg-paper pb-20 pt-12 min-[720px]:pb-24 min-[720px]:pt-20">
        <Container>
          <div className="grid grid-cols-1 items-start gap-10 min-[1024px]:grid-cols-[1.5fr_1fr] min-[1024px]:gap-16">
            <FadeIn>
              <p className="mb-8 text-base leading-[1.9] text-body min-[720px]:mb-9">
                <span className="inline-block">サービス・採用・協業など、</span>
                <span className="inline-block">
                  JQITへのお問い合わせは下記フォームよりお願いいたします。
                </span>
                <span className="text-brand">*</span>{" "}
                は必須項目です。担当者より2〜3営業日以内にご連絡いたします。
              </p>
              <ContactForm />
            </FadeIn>
            <FadeIn className="border border-line bg-cream px-5 py-7 min-[600px]:px-8 min-[600px]:py-9">
              <Kicker className="mb-6">Direct</Kicker>
              {directInfos.map((info) => (
                <div key={info.label} className="border-b border-line py-4">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {info.label}
                  </p>
                  <p
                    className={`${info.en ? "font-en text-[17px] font-medium" : "text-[15px]"} leading-[1.7] text-ink`}
                  >
                    {info.value}
                  </p>
                </div>
              ))}
              <p className="mt-5 text-[12.5px] leading-[1.9] text-muted">
                お電話でのお問い合わせは営業時間内にお願いいたします。
              </p>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}
