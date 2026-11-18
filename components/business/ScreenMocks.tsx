/**
 * 事業ページで「作る物」を見せる画像（2026-11-18）。
 * - 中身はすべて架空の画面。お客様の実データ・実画面は使わない。
 * - IT は3枚で見た目の型を変える（開発＝暗い背景の画面、インフラ＝白地の立体構成図、QA＝実機を並べた写真風）。AI はつやのある立体物と平らなカード。
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
      alt="ノートPCとスマートフォンの画面のイメージ。ノートPCは業務ポータルで、今月の案件（進行中24・完了12・確認待ち5）と案件一覧。スマートフォンは配送アプリで、本日の配送18件を午前便・午後便・夜間便に分けて表示"
    />
  );
}

export function InfraScreens() {
  return (
    <ToyScene
      src="/business-it-infra.webp"
      alt="クラウドのシステム構成を立体で描いた図。利用者からCDNを通り、クラウド上のロードバランサから2組のサーバへ分かれ、主と予備のデータベースにつながる。外側に監視とバックアップが付く"
    />
  );
}

export function QaScreens() {
  return (
    <ToyScene
      src="/business-it-qa.webp"
      alt="スマートフォン3台とタブレット2台を机に並べて動作を確かめている様子。4台は合格のチェック、1台は不合格の印と警告が出ている。横にチェックリストとペン"
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
      alt="オレンジのリボンの立体グラフィックと、新着の案件にぴったりの人を示すカード。適合度92点の「候補 A」、Java 7年・物流の経験"
    />
  );
}
