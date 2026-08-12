export type NewsSeoFaq = {
  question: string;
  answer: string;
};

export type NewsSeoOverride = {
  title: string;
  description: string;
  summary: string;
  keyPoints: readonly string[];
  faqs: readonly NewsSeoFaq[];
  relatedPath: string;
  relatedLabel: string;
};

const overrides: Record<string, NewsSeoOverride> = {
  "wp-2011": {
    title: "SESとは？意味・仕組み・受託開発との違いを解説",
    description:
      "SES（System Engineering Service）の意味と仕組み、受託開発との違いを解説します。開発・インフラ・QAなど、SESで依頼できる領域も紹介します。",
    summary:
      "SESは「System Engineering Service」の略で、エンジニアの技術力を提供し、企業のシステム開発・保守・運用を支援するサービスです。JQITでは、開発・インフラ・QAの専門人材がチーム体制でプロジェクトを支援します。",
    keyPoints: [
      "既存の開発チームに、必要な技術や経験を持つエンジニアを加えられる",
      "開発・インフラ・QAなど、プロジェクトの課題に合わせて支援領域を選べる",
      "プロジェクト単位で一括して任せる受託開発と、チームへ技術力を加えるSESを使い分けられる",
    ],
    faqs: [
      {
        question: "SESは何の略ですか？",
        answer:
          "System Engineering Serviceの略です。エンジニアの技術力を提供し、システム開発・保守・運用などを支援するサービスを指します。",
      },
      {
        question: "SESと受託開発の違いは何ですか？",
        answer:
          "受託開発はプロジェクトや開発工程をまとめて依頼する形、SESは既存チームに必要な技術力を加えてプロジェクトを支援する形です。JQITでは課題と体制に合わせて提案します。",
      },
      {
        question: "SESではどのような業務を依頼できますか？",
        answer:
          "Web・アプリ開発、インフラ設計・構築・運用、QA・第三者検証などに対応しています。必要な工程のみの相談も可能です。",
      },
    ],
    relatedPath: "/business/it-solutions",
    relatedLabel: "JQITのシステム開発・SES・QA支援を見る",
  },
  "wp-2268": {
    title: "APIとは？仕組み・具体例をわかりやすく解説",
    description:
      "API（Application Programming Interface）の意味、基本的な仕組み、地図・決済・社内システム連携などの具体例をわかりやすく解説します。",
    summary:
      "APIは「Application Programming Interface」の略で、ソフトウェア同士が決められた方法で機能やデータをやり取りするための接点です。既存サービスの機能を組み合わせ、システム開発や業務連携を効率化できます。",
    keyPoints: [
      "地図、決済、天気、チャットなど、外部サービスの機能を自社システムから利用できる",
      "社内システム間の転記や通知を自動化し、手作業を減らせる",
      "利用時は認証、アクセス権限、通信エラー、利用上限を含めた設計が必要になる",
    ],
    faqs: [
      {
        question: "APIは何の略ですか？",
        answer:
          "Application Programming Interfaceの略です。ソフトウェアやサービス同士が機能・データをやり取りするための接点を意味します。",
      },
      {
        question: "APIを使うメリットは何ですか？",
        answer:
          "既存サービスの機能を一から開発せずに利用でき、システム連携や業務自動化を短期間で実現しやすくなります。",
      },
      {
        question: "APIはどのような場面で使われますか？",
        answer:
          "地図表示、オンライン決済、天気情報、メッセージ通知、顧客管理や会計などの社内システム連携に使われます。",
      },
    ],
    relatedPath: "/business/it-solutions",
    relatedLabel: "JQITのシステム・API開発支援を見る",
  },
};

export function getNewsSeoOverride(id: string): NewsSeoOverride | undefined {
  return overrides[id];
}
