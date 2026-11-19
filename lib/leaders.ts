/**
 * 事業部長（各領域の責任者）。紹介ページ（/introduction）と事業ページの両方がここを読む。
 * 異動・退任のときはここだけ直す。個人の連絡先は載せない（窓口は共通の問い合わせ先のみ）。
 * 写真は public/leaders/*.webp（300×300、白背景）。
 */
export type LeaderKey = "ai" | "development" | "infrastructure" | "qa";

export type Leader = {
  key: LeaderKey;
  field: string;
  title: string;
  name: string;
  image: string;
  scope: string[];
  tech: string[];
  /** 顔が小さく写っている写真だけ、少し寄せて表示する */
  zoom: boolean;
};

export const leaders: Leader[] = [
  { key: "ai", field: "AI", title: "AIソリューション事業部長", name: "宮本 尚寛", image: "/leaders/miyamoto.webp", scope: ["AIシステムの開発", "既存業務へのAI導入"], tech: ["Python", "FastAPI", "LLM API", "RAG"], zoom: true },
  { key: "development", field: "開発", title: "開発事業部長", name: "大野 健", image: "/leaders/ohno.webp", scope: ["Web・モバイルアプリ", "設計から運用保守まで"], tech: ["Java", "TypeScript", "React", "Next.js"], zoom: false },
  { key: "infrastructure", field: "インフラ", title: "インフラ事業部長", name: "嵐 亮太", image: "/leaders/arashi.webp", scope: ["オンプレ・クラウド基盤", "設計・構築・運用"], tech: ["AWS", "Azure", "オンプレミス"], zoom: false },
  { key: "qa", field: "QA", title: "QA事業部長", name: "岩崎 顕儀", image: "/leaders/iwasaki.webp", scope: ["品質保証・テスト設計", "テスト自動化"], tech: ["品質計画", "第三者検証", "自動化"], zoom: true },
];

export function getLeader(key: LeaderKey): Leader {
  const found = leaders.find((l) => l.key === key);
  if (!found) throw new Error(`leader not found: ${key}`);
  return found;
}
