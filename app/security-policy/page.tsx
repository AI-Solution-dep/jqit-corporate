import { PageHeader } from "@/components/layout/PageHeader";
import { companySubNav, SubNav } from "@/components/layout/SubNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { createPageMetadata, createWebPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const pageDescription =
  "株式会社JQITの情報セキュリティ基本方針。情報資産の適切な運用管理体制の構築・維持のための方針を定めています。";

export const metadata = createPageMetadata({
  title: "情報セキュリティ基本方針",
  description: pageDescription,
  path: "/security-policy",
});

const securityJsonLd = createWebPageJsonLd({
  name: "情報セキュリティ基本方針｜株式会社JQIT",
  description: pageDescription,
  path: "/security-policy",
  breadcrumbs: [
    { name: "ホーム", path: "/" },
    { name: "情報セキュリティ基本方針", path: "/security-policy" },
  ],
});

type PolicySection = {
  title: string;
  body?: string[];
  list?: string[];
};

const sections: PolicySection[] = [
  {
    title: "情報セキュリティの目的",
    body: [
      "当社は、情報資産を適切に取り扱い保護することが企業としての社会的責務であると考えます。",
      "ゆえに、当社は情報セキュリティの重要性を鑑み、業務に係わる一切の情報資産の消失、盗難、不正使用、改竄、漏洩を防止することによって、情報セキュリティを管理・運営していくことを目的とします。",
    ],
  },
  {
    title: "情報セキュリティの定義",
    body: ["情報セキュリティとは、情報資産の機密性、完全性、および可用性を維持することと定義します。"],
    list: [
      "情報資産とは、お客様および当社が所有する情報です。情報の範囲は、情報システムに存在するソフトウェア、ハードウェアである電子的機器、媒体にとどまらず、音声・文字・画像・映像のすべての形態を含みます。",
      "情報資産の機密性とは、情報資産が照会する権限を持つもののみが参照可能であり、照会する権限を持たないものは参照不可能であることです。",
      "情報資産の完全性とは、情報資産が正確かつ完全に維持されることです。",
      "情報資産の可用性とは、情報資産が必要なときに定められた方法で、真正性、信頼性、および利用証跡の確保を維持した状態で、利用されることです。",
    ],
  },
  {
    title: "適用範囲",
    body: ["当社における一切の事業とそれに従事する全ての役員、社員および協力会社社員に対して適用する。"],
  },
  {
    title: "情報セキュリティの組織体制",
    body: ["当社は、情報セキュリティを実現するために、組織体制を設けます。"],
    list: [
      "情報セキュリティに関する問題の最上位意思決定機関として、情報セキュリティ委員会を設置します。情報セキュリティ委員会の委員長は、役員または執行役員がこれを担当します。",
      "情報セキュリティのマネージメントシステムを確立し、導入、運用、監視、見直し、および改善を掌る情報セキュリティ統括責任者を設けます。情報セキュリティ統括責任者は情報セキュリティ委員会がこれを任命します。",
      "情報セキュリティが部門ごとに適切に管理、運用されるために、各部門に情報セキュリティ責任者を設けます。情報セキュリティ責任者は情報セキュリティ統括責任者が選任し、情報セキュリティ委員会がこれを任命します。",
      "情報セキュリティが適正に実現、管理、運用され、改善が必要な場合に見直しが実施されていることを監視するための責任者として情報セキュリティ監査責任者を設けます。情報セキュリティ監査責任者は情報セキュリティ委員会がこれを任命します。",
    ],
  },
  {
    title: "情報セキュリティの運用管理",
    body: ["当社は、情報セキュリティの適正な運用管理を維持するために、情報資産を次の通り運用し管理します。"],
    list: [
      "情報資産に対する権限は、業務上必要な者にのみ必要な権限を与えます。",
      "情報資産は、法律、契約に従い、合理的かつ適切に管理します。",
      "情報資産の管理を、適切に実施していることを継続的に監視します。",
      "当社の全ての役員、社員および協力会社社員は、情報セキュリティ教育を定期的に受講するものとします。",
      "情報セキュリティに関する事故が発生した場合、および、事故の発生の可能性を持つ脅威に遭遇した場合、速やかに対処し事業の継続性を維持することに努めるとともに、状況、原因を分析し必要に応じて再発防止策を講じます。",
    ],
  },
  {
    title: "個人情報保護",
    body: ["個人情報を適切に取り扱い保護するために、個人情報を次の通り運用し管理します。"],
    list: [
      "個人情報は、業務上ならびに従業員の雇用、人事管理上特定した業務の遂行に利用する目的に必要な範囲と期間に限定して、取得、利用、提供します。",
      "個人情報に対しては、法律や関連省庁の指針および規範に則り、合理的な安全対策を講じ、継続的に維持、向上します。",
      "個人情報に関する苦情、訂正、開示等のご請求に迅速かつ誠実に対応します。",
    ],
  },
  {
    title: "周知",
    body: [
      "本方針書は、全ての役員、社員および協力会社社員に対して周知徹底します。",
      "本方針書および情報セキュリティに関連する規定に違反した場合は、就業規則もしくは契約に則り懲戒処分を適用します。",
    ],
  },
  {
    title: "維持",
    body: ["当社は、情報セキュリティ方針書を毎年度または必要に応じてレビューし維持します。"],
  },
];

export default function SecurityPolicyPage() {
  return (
    <>
      <JsonLd data={securityJsonLd} />
      <PageHeader title="情報セキュリティ基本方針" en="Security Policy" />
      <SubNav group="Company" items={companySubNav} />
      <section className="bg-paper pb-24 pt-14 min-[720px]:pt-16">
        <Container className="max-w-[860px]">
          <FadeIn>
            <p className="text-[15px] leading-[2.1] text-body">
              当社における情報セキュリティの適切な運用管理体制の構築・維持を目的として、ここに情報セキュリティ基本方針を定めます。
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
            </FadeIn>
          ))}

          <FadeIn className="mt-16 border-t border-ink pt-8 text-right">
            <p className="font-mono text-[12px] tracking-[0.08em] text-muted">
              2024年12月6日 制定
            </p>
            <p className="mt-3 text-[15px] font-bold text-ink">{siteConfig.name}</p>
            <p className="mt-1 text-[13.5px] text-body">代表取締役　{siteConfig.ceo}</p>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
