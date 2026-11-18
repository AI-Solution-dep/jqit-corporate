/**
 * 事業ページで「作る物」を見せる画像（2026-11-18）。
 * - 中身はすべて架空の画面。お客様の実データ・実画面は使わない。
 * - IT は濃紺の背景に業務画面・構成図・テスト結果を置いた製品サイト風、AI はつやのある立体物と平らなカード。
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
      alt="システム構成図と監視画面のイメージ。構成図は利用者からCDNを通り、クラウド上のロードバランサ、2台のWebサーバ、主と予備のデータベースへつながり、監視とバックアップが付く。監視画面はCPU 32%・メモリ 58%・応答時間 120ms、CPU使用率の推移、4台のサーバがすべて正常"
    />
  );
}

export function QaScreens() {
  return (
    <ToyScene
      src="/business-it-qa.webp"
      alt="テスト結果の画面のイメージ。端末・ブラウザ別の表では6種類の端末と4つの機能のうち22件が合格し、帳票が2つの端末で不合格。自動テストの実行結果は5件合格・1件失敗（CSVの出力でダウンロードが完了しない）で、不具合 BUG-128 を起票済み"
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
