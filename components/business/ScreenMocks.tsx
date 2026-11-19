/**
 * 事業ページで「作る物」を見せる画像（2026-11-18）。
 * - 中身はすべて架空の画面。お客様の実データ・実画面は使わない。
 * - IT も AI も同じ絵柄にそろえる（2026-11-19）：淡い桃色の背景、つやのある硬い立体物、左に平らなカード・右に立体物。
 *   作り直すときは business-ai-agent.webp を手本として画像生成（edits）に渡す。
 *   どちらも画像生成で作り、画面の文字も画像に描き込んである（HTML の画面モックは細かすぎて見劣りしたため、オーナー判断で置き換え）。
 * - 画像の中の文字は読み上げられないので、alt に中身を書く。
 */
import Image from "next/image";

function ToyScene({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="toy-scene">
      <Image src={src} alt={alt} width={1536} height={1024} sizes="(min-width: 900px) 55vw, 100vw" className="toy-scene-img" />
    </div>
  );
}

/* ===== IT ソリューション ===== */

export function DevScreens() {
  return (
    <ToyScene
      src="/business-it-dev.webp"
      alt="業務ポータルのカードと、ノートPC・スマートフォンのイラスト。カードは今月の案件（進行中24・完了12・確認待ち5）と案件一覧。スマートフォンは配送アプリで、本日の配送18件を表示"
    />
  );
}

export function InfraScreens() {
  return (
    <ToyScene
      src="/business-it-infra.webp"
      alt="監視画面のカードと、クラウド・サーバ・データベースのイラスト。カードには稼働率 99.9%、サーバは正常、バックアップは完了と表示"
    />
  );
}

export function QaScreens() {
  return (
    <ToyScene
      src="/business-it-qa.webp"
      alt="テスト結果のカードと、スマートフォン・タブレット・虫めがねのイラスト。カードにはログイン・注文・通知が合格、決済が不合格、4件中3件が合格と表示"
    />
  );
}

/* ===== AI ソリューション ===== */

export function AgentScreens() {
  return (
    <ToyScene
      src="/business-ai-agent.webp"
      alt="ロボットが虫めがねで書類を調べるイラスト。画面のカードには「来月の発注量の案を作って」という依頼と、「上位3品目を +8% で提案」という答え、「承認する」「修正」のボタンが並ぶ"
    />
  );
}

export function EnablementScreens() {
  return (
    <ToyScene
      src="/business-ai-enable.webp"
      alt="旗の立った3段の階段のイラスト。カードには「業務を整理（完了）」「小さく試す（いまここ）」「社内に広げる」の3つの段階が並ぶ"
    />
  );
}

export function ProductScreens() {
  return (
    <ToyScene
      src="/business-ai-ribbon.webp"
      alt="新着の案件と、ぴったりの人を示す2枚のカードと、噛み合うパズルのイラスト。案件は Java 開発・物流システム・経験5年以上。候補 A は適合度92点、Java 7年・物流の経験"
    />
  );
}
