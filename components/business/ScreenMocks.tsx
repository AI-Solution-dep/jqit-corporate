/**
 * 事業ページで「作る物」を見せるための画面モック（2026-11-18）。
 * - 中身はすべて架空の画面。お客様の実データ・実画面は使わない。
 * - 画像ではなく HTML で組む（文字がくっきり出て軽い）。読み上げには説明文だけを渡し、中身は隠す。
 * - 見た目は globals.css の `.mock-*`。PC は 640×440 の画面を基準に組み、狭い画面では zoom で縮める。
 */
import type { ReactNode } from "react";

function Stage({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mock-stage" role="img" aria-label={label}>
      <div className="mock-canvas" aria-hidden>
        {children}
      </div>
    </div>
  );
}

function Laptop({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mock-laptop mock-shadow ${className}`}>
      <div className="mock-laptop-screen">{children}</div>
      <div className="mock-laptop-base" />
    </div>
  );
}

function Phone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mock-phone mock-shadow ${className}`}>
      <div className="mock-phone-screen">{children}</div>
    </div>
  );
}

function Win({ title, children, className = "", dark = false }: { title: string; children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={`mock-win mock-shadow ${dark ? "mock-win--dark" : ""} ${className}`}>
      <div className="mock-win-bar">
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      <div className="mock-win-body">{children}</div>
    </div>
  );
}

/* ===== IT ソリューション ===== */

export function DevScreens() {
  const rows = [
    ["在庫連携 API", "開発", "12/05", "進行中"],
    ["受発注画面の改修", "開発", "12/12", "進行中"],
    ["アプリ v2.4 リリース", "モバイル", "11/28", "完了"],
    ["帳票出力の高速化", "開発", "12/20", "進行中"],
    ["ログイン基盤の移行", "インフラ", "12/26", "進行中"],
  ];
  return (
    <Stage label="開発する業務システムとスマートフォンアプリの画面イメージ">
      <Laptop className="mock-at-dev-laptop">
        <div className="mock-app">
          <div className="mock-app-side">
            <b>業務ポータル</b>
            <i className="is-on">ダッシュボード</i>
            <i>案件</i>
            <i>顧客</i>
            <i>請求</i>
            <i>設定</i>
          </div>
          <div className="mock-app-main">
            <div className="mock-row-between">
              <b className="mock-h">今月の案件</b>
              <span className="mock-btn">＋ 新規登録</span>
            </div>
            <div className="mock-kpis">
              <div><small>進行中</small><b>24</b></div>
              <div><small>今月の完了</small><b>12</b></div>
              <div><small>確認待ち</small><b>5</b></div>
            </div>
            <div className="mock-table">
              <div className="mock-tr is-head"><span>案件名</span><span>担当</span><span>期限</span><span>状態</span></div>
              {rows.map((r) => (
                <div key={r[0]} className="mock-tr">
                  <span>{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span>
                  <span><i className={r[3] === "完了" ? "mock-tag is-done" : "mock-tag"}>{r[3]}</i></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Laptop>
      <Phone className="mock-at-dev-phone">
        <div className="mock-phone-head">おはようございます<b>本日の配送 18件</b></div>
        <div className="mock-card"><b>午前便　9:00–12:00</b><small>6件・千代田区</small></div>
        <div className="mock-card"><b>午後便　13:00–17:00</b><small>9件・中央区</small></div>
        <div className="mock-card"><b>夜間便　18:00–21:00</b><small>3件・港区</small></div>
        <div className="mock-tabs"><span className="is-on">ホーム</span><span>配送</span><span>履歴</span><span>設定</span></div>
      </Phone>
    </Stage>
  );
}

export function InfraScreens() {
  return (
    <Stage label="サーバの稼働を監視する画面とターミナルのイメージ">
      <Win title="monitor / production" dark className="mock-at-infra-win">
        <div className="mock-mets">
          <div><small>CPU</small><b>32<em>%</em></b></div>
          <div><small>メモリ</small><b>58<em>%</em></b></div>
          <div><small>リクエスト/分</small><b>1,240</b></div>
          <div><small>稼働状況</small><b className="mock-ok">正常</b></div>
        </div>
        <div className="mock-chart">
          <svg viewBox="0 0 580 110" preserveAspectRatio="none">
            <path d="M0 80 L40 74 L80 78 L120 60 L160 64 L200 46 L240 52 L280 38 L320 42 L360 30 L400 36 L440 24 L480 32 L520 20 L580 26 L580 110 L0 110Z" className="mock-chart-fill" />
            <polyline points="0,80 40,74 80,78 120,60 160,64 200,46 240,52 280,38 320,42 360,30 400,36 440,24 480,32 520,20 580,26" className="mock-chart-line" />
          </svg>
        </div>
        <div className="mock-servers">
          {["web-01", "web-02", "db-primary", "batch-01"].map((s) => (
            <div key={s}>{s}<span className="mock-ok">OK</span></div>
          ))}
        </div>
      </Win>
      <div className="mock-term mock-shadow mock-at-infra-term">
        $ aws ec2 describe-instances
        <br />&gt; 4 instances <em>running</em>
        <br />$ systemctl status nginx
        <br />&gt; active (running)
        <br />$ <em>▍</em>
      </div>
    </Stage>
  );
}

/** 検証端末に映す、同じ注文確認画面。broken のときは決済ボタンが下のバーに隠れる（見つけた不具合） */
function OrderScreen({ broken = false }: { broken?: boolean }) {
  return (
    <div className={`mock-order ${broken ? "is-broken" : ""}`}>
      <b className="mock-order-title">注文内容の確認</b>
      <div className="mock-order-item"><span>業務用 用紙 A4</span><span>¥4,800</span></div>
      <div className="mock-order-item"><span>トナー カートリッジ</span><span>¥12,600</span></div>
      <div className="mock-order-item"><span>配送料</span><span>¥0</span></div>
      <div className="mock-order-total"><span>合計</span><b>¥17,400</b></div>
      <span className="mock-order-btn">注文を確定する</span>
      {broken && <span className="mock-order-bar">ホーム　カート　履歴</span>}
    </div>
  );
}

export function QaScreens() {
  return (
    <Stage label="同じ画面を複数の端末で見比べ、見つけた不具合に印を付けて報告する検証のイメージ">
      <div className="mock-tablet mock-shadow mock-at-qa-tablet">
        <div className="mock-tablet-screen"><OrderScreen /></div>
      </div>
      <Phone className="mock-at-qa-ios"><OrderScreen /></Phone>
      <div className="mock-android mock-shadow mock-at-qa-android">
        <div className="mock-android-screen"><OrderScreen broken /></div>
      </div>
      <div className="mock-bug mock-at-qa-bug">
        <b>不具合 #128</b>
        決済ボタンが下のバーに隠れる
      </div>
      <div className="mock-device-labels mock-at-qa-labels">
        <span>タブレット<b>OK</b></span>
        <span>iOS<b>OK</b></span>
        <span>Android<b className="mock-fail">NG</b></span>
      </div>
      <div className="mock-summary mock-shadow mock-at-qa-summary">
        <div className="mock-row-between">
          <b>回帰テスト　第14回</b>
          <span className="mock-tag is-done">122 / 130 合格</span>
        </div>
        <div className="mock-progress"><i /></div>
        <span className="mock-muted">合格 122 ・ 不具合 3 ・ 確認中 5</span>
      </div>
    </Stage>
  );
}

/* ===== AI ソリューション ===== */

export function AgentScreens() {
  return (
    <Stage label="社内データを参照して作業を進め、重要な操作の前に承認を求めるAIエージェントの画面イメージ">
      <Win title="ai-agent / 業務アシスタント" className="mock-at-agent-win">
        <div className="mock-chat">
          <p className="mock-msg is-user">先月の受注データから、来月の発注量の案を作ってください。</p>
          <div className="mock-msg is-ai">
            <span className="mock-steps">
              <i>✓ 受注データを取得（12,480件）</i>
              <i>✓ 品目ごとに集計</i>
              <i>✓ 社内規程「発注基準」を参照</i>
            </span>
            発注量の案を作成しました。上位3品目は前月比 +8% です。
            <span className="mock-source">参照：発注基準 v3.pdf ／ 受注実績 2026-10</span>
          </div>
          <div className="mock-approve">
            <span>発注書を作成して、購買部へ送信しますか？</span>
            <span className="mock-btn">承認する</span>
            <span className="mock-btn is-ghost">修正する</span>
          </div>
        </div>
      </Win>
    </Stage>
  );
}

export function EnablementScreens() {
  const rows = [
    ["問い合わせの一次回答", "自動化", "is-auto"],
    ["見積書の下書き", "AIが下書き → 人が確認", "is-mix"],
    ["議事録の要約・共有", "自動化", "is-auto"],
    ["契約条件の判断", "人が判断", "is-human"],
    ["請求データの照合", "AIが下書き → 人が確認", "is-mix"],
  ];
  return (
    <Stage label="業務ごとに、AIに任せる範囲と人が判断する範囲を整理した表のイメージ">
      <Win title="ai-roadmap / 業務の棚卸し" className="mock-at-enable-win">
        <div className="mock-row-between">
          <b className="mock-h">AI活用の対象業務</b>
          <span className="mock-muted">営業部・管理部</span>
        </div>
        <div className="mock-table is-wide">
          <div className="mock-tr is-head"><span>業務</span><span>AIと人の分担</span><span>開始</span></div>
          {rows.map((r, i) => (
            <div key={r[0]} className="mock-tr">
              <span>{r[0]}</span>
              <span><i className={`mock-split ${r[2]}`}>{r[1]}</i></span>
              <span className="mock-muted">{["1月", "1月", "2月", "—", "3月"][i]}</span>
            </div>
          ))}
        </div>
        <div className="mock-legend">
          <span><i className="mock-split is-auto">自動化</i></span>
          <span><i className="mock-split is-mix">AIと人で分担</i></span>
          <span><i className="mock-split is-human">人が判断</i></span>
        </div>
      </Win>
    </Stage>
  );
}

export function ProductScreens() {
  return (
    <Stage label="AIが候補を選び、合う理由を示すマッチング画面のイメージ">
      <Laptop className="mock-at-product-laptop">
        <div className="mock-app is-plain">
          <div className="mock-app-main">
            <div className="mock-row-between">
              <b className="mock-h">新着の案件　Java / 物流システム</b>
              <span className="mock-tag">AIが構造化済み</span>
            </div>
            <div className="mock-fields">
              <span><small>言語</small>Java・Spring</span>
              <span><small>期間</small>2月〜 長期</span>
              <span><small>場所</small>リモート併用</span>
              <span><small>人数</small>2名</span>
            </div>
            <div className="mock-match">
              {[
                ["候補 A", "92", "Java 7年・物流の業務経験あり"],
                ["候補 B", "85", "Spring 経験・2月から参画可能"],
                ["候補 C", "78", "リモート併用を希望"],
              ].map(([n, s, why]) => (
                <div key={n}>
                  <b>{n}</b>
                  <span className="mock-score">{s}</span>
                  <small>{why}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Laptop>
      <Phone className="mock-at-product-phone">
        <div className="mock-phone-head">提案メール<b>AIの下書き</b></div>
        <div className="mock-card mock-mail">
          <small>件名：Java 案件のご提案</small>
          <span>ご紹介いただいた物流システムの案件について、条件に合う候補をご提案します。</span>
        </div>
        <div className="mock-tabs"><span className="is-on">下書き</span><span>送信</span></div>
      </Phone>
    </Stage>
  );
}
