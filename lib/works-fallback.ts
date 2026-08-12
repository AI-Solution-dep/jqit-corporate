import type { Work } from "./works";

/**
 * microCMS の works エンドポイント未作成時に表示するサンプル。
 * ★実在の案件ではない★ ため、画面上にもサンプルである旨のバナーを出す。
 * microCMS 側に1件でも登録されれば、こちらは表示されなくなる。
 */
export const fallbackWorks: Work[] = [
  {
    id: "sample-manufacturing-qa",
    title: "基幹システム刷新にともなうQA自動化と品質基盤の構築",
    date: "2026-03-31",
    client: "大手製造業A社",
    clientDisclosed: false,
    industry: "製造",
    serviceType: "システムテスト・QA",
    period: "2025.06 - 2026.03",
    scale: "6名 / 10ヶ月",
    summary:
      "手動に依存していたリグレッションテストを自動化し、リリースサイクルを短縮。テスト設計の標準化まで含めて内製化を支援しました。",
    metrics: [
      { label: "リグレッション工数", value: "-62%" },
      { label: "リリース頻度", value: "月1回 → 週1回" },
      { label: "本番障害", value: "-45%" },
    ],
    techStack: ["Playwright", "TypeScript", "GitHub Actions", "Azure"],
    challenge:
      "<p>リリースのたびに全画面を手作業で確認しており、検証だけで2週間を要していました。担当者の暗黙知に依存し、テスト観点が属人化していた点も課題でした。</p>",
    approach:
      "<p>ISTQBの技法にもとづきテスト観点を再設計し、優先度の高いシナリオからPlaywrightで自動化。CIに組み込み、プルリクエスト単位で回帰検証が走る体制へ移行しました。</p><p>あわせて、テスト設計書のフォーマットと運用ルールを整備し、お客様側での内製運用に引き継ぎました。</p>",
    result:
      "<p>リグレッションテストの工数を62%削減し、月1回だったリリースを週次へ移行。本番障害の件数も45%減少しました。</p>",
    isSample: true,
  },
  {
    id: "sample-retail-ai",
    title: "問い合わせ対応のAIエージェント導入と社内定着支援",
    date: "2026-01-31",
    client: "小売業B社",
    clientDisclosed: false,
    industry: "小売",
    serviceType: "AI導入支援",
    period: "2025.09 - 2026.01",
    scale: "4名 / 5ヶ月",
    summary:
      "社内問い合わせをAIエージェントで一次対応。PoCから本番運用、社内教育までを一貫して伴走しました。",
    metrics: [
      { label: "一次対応の自動化率", value: "71%" },
      { label: "平均応答時間", value: "4時間 → 30秒" },
    ],
    techStack: ["Next.js", "TypeScript", "Claude API", "Vercel"],
    challenge:
      "<p>情報システム部門に日次で100件以上の問い合わせが集中し、本来のプロジェクト業務が圧迫されていました。</p>",
    approach:
      "<p>既存の社内ドキュメントを整理したうえでRAGを構築し、回答できない質問は人へエスカレーションする設計にしました。導入後は利用ログをもとに月次でチューニングし、社内向けの活用研修も実施しています。</p>",
    result:
      "<p>問い合わせの71%がAIで完結し、平均応答時間は4時間から30秒に短縮。情報システム部門の残業時間も削減されました。</p>",
    isSample: true,
  },
];
