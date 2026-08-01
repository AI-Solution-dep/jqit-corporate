import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { createPageMetadata, createWebPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const pageDescription =
  "株式会社JQITのプライバシーポリシー。個人情報の取得、利用目的、第三者提供、安全管理、開示等の請求について定めています。";

export const metadata = createPageMetadata({
  title: "プライバシーポリシー",
  description: pageDescription,
  path: "/privacy-policy",
});

const privacyJsonLd = createWebPageJsonLd({
  name: "プライバシーポリシー｜株式会社JQIT",
  description: pageDescription,
  path: "/privacy-policy",
  breadcrumbs: [
    { name: "ホーム", path: "/" },
    { name: "プライバシーポリシー", path: "/privacy-policy" },
  ],
});

type PolicySection = {
  title: string;
  body?: string[];
  list?: string[];
};

const sections: PolicySection[] = [
  {
    title: "事業者情報",
    body: [
      `${siteConfig.name}（以下「当社」といいます。）は、当社が提供するサービスおよび当社Webサイトにおいて取得する個人情報を、個人情報の保護に関する法令、ガイドラインその他関連する規範に従い、適切に取り扱います。`,
    ],
  },
  {
    title: "取得する個人情報",
    body: [
      "当社は、お問い合わせ、採用、協業のご相談、その他当社サービスに関するご連絡の際に、必要な範囲で個人情報を取得します。",
    ],
    list: [
      "氏名、会社名、部署名",
      "メールアドレス、電話番号",
      "お問い合わせ種別、お問い合わせ内容",
      "当社との連絡、商談、契約、サービス提供に伴い取得する情報",
    ],
  },
  {
    title: "利用目的",
    body: ["当社は、取得した個人情報を以下の目的で利用します。"],
    list: [
      "お問い合わせ、ご相談、資料請求等への回答および連絡のため",
      "当社サービスの提案、提供、契約、請求、保守、サポートのため",
      "採用応募者への連絡、選考、採用管理のため",
      "協業、業務委託、取引先管理に関する連絡および手続きのため",
      "当社サービスおよびWebサイトの改善、品質向上のため",
      "法令、規約、契約等に基づく対応のため",
    ],
  },
  {
    title: "第三者提供",
    body: [
      "当社は、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。",
    ],
  },
  {
    title: "外部委託",
    body: [
      "当社は、利用目的の達成に必要な範囲で、個人情報の取り扱いを外部事業者に委託する場合があります。この場合、委託先に対して必要かつ適切な監督を行います。",
    ],
  },
  {
    title: "安全管理措置",
    body: [
      "当社は、個人情報の漏えい、滅失、き損、不正アクセス等を防止するため、組織的、人的、物理的、技術的な安全管理措置を講じます。",
    ],
  },
  {
    title: "開示等の請求",
    body: [
      "本人から、個人情報の開示、訂正、追加、削除、利用停止、消去、第三者提供の停止等の請求があった場合、当社は本人確認のうえ、法令に従い合理的な範囲で速やかに対応します。",
    ],
  },
  {
    title: "Cookie等の利用",
    body: [
      "当社Webサイトでは、利便性の向上、閲覧状況の把握、サービス改善のためにCookie等を利用する場合があります。ブラウザの設定によりCookieの受け入れを拒否できますが、その場合、一部機能が利用できないことがあります。",
    ],
  },
  {
    title: "改定",
    body: [
      "当社は、法令改正、事業内容の変更、サービス改善等に応じて、本ポリシーを改定することがあります。重要な変更がある場合は、当社Webサイト上で告知します。",
    ],
  },
  {
    title: "お問い合わせ窓口",
    body: [
      `個人情報の取り扱いに関するお問い合わせは、${siteConfig.name}までご連絡ください。`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={privacyJsonLd} />
      <PageHeader title="プライバシーポリシー" en="Privacy Policy" />
      <section className="bg-paper pb-24 pt-14 min-[720px]:pt-16">
        <Container className="max-w-[860px]">
          <FadeIn>
            <p className="text-[15px] leading-[2.1] text-body">
              当社は、お客様、採用応募者、取引先その他関係者の個人情報を適切に取り扱うため、以下のとおりプライバシーポリシーを定めます。
            </p>
          </FadeIn>

          {sections.map((s, i) => (
            <FadeIn key={s.title} className="mt-12">
              <h2 className="flex items-baseline gap-4 border-b border-line pb-4">
                <span className="font-mono text-[13px] font-semibold tracking-[0.1em] text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="palt text-[19px] font-bold tracking-[-0.01em] text-ink min-[720px]:text-[21px]">
                  {s.title}
                </span>
              </h2>
              {s.body?.map((p) => (
                <p key={p} className="mt-5 text-[14.5px] leading-[2.05] text-body">
                  {p}
                </p>
              ))}
              {s.list && (
                <ol className="mt-5 space-y-3.5">
                  {s.list.map((item, j) => (
                    <li
                      key={item}
                      className="grid grid-cols-[auto_1fr] gap-3.5 text-[14px] leading-[2] text-body"
                    >
                      <span className="font-mono text-[12px] leading-[2.35] text-muted">
                        ({j + 1})
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              )}
              {s.title === "お問い合わせ窓口" && (
                <Link
                  href="/contact"
                  className="mt-5 inline-flex text-sm font-semibold text-brand underline underline-offset-4"
                >
                  お問い合わせフォームへ
                </Link>
              )}
            </FadeIn>
          ))}

          <FadeIn className="mt-16 border-t border-ink pt-8 text-right">
            <p className="font-mono text-[12px] tracking-[0.08em] text-muted">
              2026年7月7日 制定
            </p>
            <p className="mt-3 text-[15px] font-bold text-ink">{siteConfig.name}</p>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
