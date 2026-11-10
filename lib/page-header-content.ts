/**
 * 下層の見出し帯に添えるリード文と写真。PageHeader の `en` をキーに引く。
 * 写真は同じページの最初のセクションと重ならないものを選ぶ。
 * ヒーロー用の合成素材（白地に斜めの切り抜き）は枠に収めると白地が写るため使わない。
 * public/page-header/ は既存写真を参考画像にして gpt-image-2.5 で生成した見出し帯専用の写真（2026-11-10）。
 * 法務ページは本文を読む場所なので写真を置かない。
 */
export type PageHeaderContent = {
  lead: string;
  photo?: {
    src: string;
    alt: string;
    /** 切り抜き位置。人物や窓の景色が枠に収まるよう寄せる */
    position?: string;
  };
};

export const pageHeaderContent: Record<string, PageHeaderContent> = {
  About: {
    lead: "JQITの成り立ちと、私たちが大切にしていること。代表メッセージから会社概要・アクセスまでをまとめています。",
    photo: { src: "/natural-tech-team.webp", alt: "打ち合わせをするJQITの社員" },
  },
  Vision: {
    lead: "挑戦と革新で、顧客の未来を切り拓く。その理念を、日々の行動指針とDXの取り組みに落とし込んでいます。",
    photo: { src: "/page-header/vision.webp", alt: "夕暮れのオフィスから街を見渡す社員", position: "62% 50%" },
  },
  "IT Solutions": {
    lead: "要件定義から運用保守まで。SES・受託開発・インフラ・QAを、ひとつのチームとして提供します。",
    photo: { src: "/natural-tech-about.webp", alt: "オフィスで打ち合わせをするエンジニア" },
  },
  "AI Solutions": {
    lead: "生成AIの導入支援から、AIエージェント開発、自社サービスNOVAまで。現場で使えるAIを、業務に合わせてつくります。",
    photo: { src: "/page-header/ai.webp", alt: "モニターのAIワークフローを確認するエンジニア", position: "60% 50%" },
  },
  Works: {
    lead: "お客様と取り組んだ、システム開発・AI導入の事例を紹介します。",
    photo: { src: "/page-header/works.webp", alt: "お客様に提案内容を説明するコンサルタント", position: "62% 50%" },
  },
  News: {
    lead: "プレスリリース、イベント、社内の取り組みなど、JQITの「今」をお届けします。",
    photo: { src: "/page-header/news.webp", alt: "朝のオフィスを歩きながら話す社員" },
  },
  Column: {
    lead: "現場のエンジニアが、開発・AI・品質保証の知見を発信しています。",
    photo: { src: "/natural-tech-ai.webp", alt: "AIのデータを囲んで議論するチーム" },
  },
  Contact: {
    lead: "ご相談の段階は問いません。課題の整理からでも、お気軽にお問い合わせください。",
    photo: { src: "/page-header/contact.webp", alt: "来訪者の相談に応じるスタッフ", position: "60% 50%" },
  },
  "Privacy Policy": {
    lead: "お客様、採用応募者、取引先の皆さまの個人情報の取り扱いについて定めています。",
  },
  "Security Policy": {
    lead: "情報資産を守り、お客様に信頼いただくための当社の基本方針です。",
  },
};
