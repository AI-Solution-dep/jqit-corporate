import type { News } from "./microcms";

/**
 * microCMS 未接続時（環境変数なし・API障害）のフォールバックデータ。
 * 既存HP（jqit.co.jp）のNEWSを元にした実データ。接続後は microCMS 側が優先される。
 */
export const fallbackNews: News[] = [
  {
    id: "site-renewal-2026",
    title: "コーポレートサイトをリニューアルしました",
    date: "2026-07-03",
    authorName: "株式会社JQIT",
    authorRole: "広報",
    category: "お知らせ",
    eyecatch: {
      url: "/natural-tech-wide.webp",
      width: 1915,
      height: 821,
    },
    body: "<p>株式会社JQITは、コーポレートサイトを全面リニューアルしました。</p><p>事業内容や製品情報をより分かりやすくお届けするとともに、ニュースやSNSを通じて、JQITの「今」を継続的に発信してまいります。今後ともよろしくお願いいたします。</p>",
  },
  {
    id: "soukai-202604",
    title: "社員総会を開催しました",
    date: "2026-04-15",
    authorName: "株式会社JQIT",
    authorRole: "広報",
    category: "イベント",
    eyecatch: {
      url: "/natural-tech-team.webp",
      width: 1122,
      height: 1402,
    },
    gallery: [
      {
        url: "/natural-tech-about.webp",
        width: 1672,
        height: 941,
      },
      {
        url: "/natural-tech-wide.webp",
        width: 1915,
        height: 821,
      },
    ],
    body: "<p>2026年4月、全社員が集まる社員総会を開催しました。</p><p>事業方針の共有や表彰、チームを越えた交流を通じて、会社の目指す方向をあらためて全員で確認する機会となりました。</p>",
  },
  {
    id: "kouryu-202604",
    title: "社員交流イベントを開催しました",
    date: "2026-04-12",
    authorName: "株式会社JQIT",
    authorRole: "広報",
    category: "イベント",
    eyecatch: {
      url: "/natural-tech-wide.webp",
      width: 1915,
      height: 821,
    },
    body: "<p>社員同士の交流を深めるイベントを開催しました。</p><p>普段は別々の現場で活躍するメンバーが一堂に会し、親睦を深めました。JQITでは、こうした交流の場を定期的に設けています。</p>",
  },
  {
    id: "iso27001-isms-20260306",
    title: "ISO27001（ISMS）認証取得のお知らせ",
    date: "2026-03-06",
    authorName: "株式会社JQIT",
    authorRole: "情報セキュリティ担当",
    category: "お知らせ",
    body: '<p>株式会社JQITは、情報セキュリティマネジメントシステムの国際規格であるISO27001（ISMS）認証を取得いたしましたのでお知らせいたします。</p><figure><img src="/badges/isms-iso27001.png" alt="ISO/IEC 27001（ISMS）" width="200" height="78"></figure><p>本認証は、情報資産を適切に管理・保護するための体制が、国際規格に基づき構築・運用されていることを第三者機関により認証されたものです。</p><p>今後も情報セキュリティ体制の継続的な改善、向上に努めてまいります。</p>',
  },
];
