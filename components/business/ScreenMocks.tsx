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
      <div className="mock-infra-card mock-shadow mock-at-infra-term">
        <b className="mock-h">構成</b>
        {[
          ["ネットワーク", "VPC・サブネット 4"],
          ["負荷分散", "ロードバランサ"],
          ["サーバ", "Linux × 4"],
          ["データベース", "冗長構成（2台）"],
          ["監視", "アラーム 0件"],
        ].map(([k, v]) => (
          <div key={k}>
            <span className="mock-muted">{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
    </Stage>
  );
}

/** QA：開発の工程のどこで検証が入るか（上）と、自動テスト（Playwright）の実行ログ（下） */
export function QaScreens() {
  const steps = ["要件定義", "設計", "開発", "テスト", "リリース"];
  const log: { ok: boolean; name: string; time: string; err?: string }[] = [
    { ok: true, name: "ログイン › 正しいパスワードでログインできる", time: "1.2s" },
    { ok: true, name: "注文 › カートに商品を追加できる", time: "0.8s" },
    { ok: true, name: "注文 › 注文を確定できる", time: "2.1s" },
    { ok: false, name: "帳票 › CSV を出力できる", time: "5.0s", err: "Error: ダウンロードが完了しない" },
    { ok: true, name: "会員 › パスワードを再設定できる", time: "1.6s" },
    { ok: true, name: "検索 › 条件で絞り込める", time: "0.9s" },
  ];
  return (
    <Stage label="開発の工程のどこで第三者検証とテスト自動化が入るかの図と、自動テストの実行結果のイメージ">
      <div className="mock-lane mock-shadow mock-at-qa-lane">
        <div className="mock-row-between">
          <b className="mock-h">工程と検証の範囲</b>
          <span className="mock-muted">プロジェクト計画</span>
        </div>
        <div className="mock-lane-steps">
          {steps.map((st) => (
            <span key={st}>{st}</span>
          ))}
        </div>
        <div className="mock-lane-bars">
          <i className="is-plan">テスト計画・設計</i>
          <i className="is-verify">第三者検証</i>
          <i className="is-auto">回帰テスト（自動）</i>
        </div>
      </div>
      <div className="mock-log mock-shadow mock-at-qa-log">
        <div className="mock-log-bar">
          <i />
          <i />
          <i />
          <span>npx playwright test</span>
        </div>
        <div className="mock-log-body">
          <p className="mock-log-dim">Running 6 tests using 3 workers</p>
          {log.map((l) => (
            <p key={l.name} className={l.ok ? "" : "is-fail"}>
              <b>{l.ok ? "✓" : "✕"}</b> {l.name} <span className="mock-log-dim">({l.time})</span>
              {l.err && <span className="mock-log-err">{l.err}</span>}
            </p>
          ))}
          <p className="mock-log-sum">
            <b className="mock-log-pass">5 passed</b>　<b className="mock-log-failc">1 failed</b>　<span className="mock-log-dim">(11.6s)</span>
          </p>
        </div>
      </div>
      <div className="mock-bug mock-at-qa-bug">
        <b>BUG-128 起票済み</b>
        開発チームへ再現手順を共有
      </div>
    </Stage>
  );
}

/* ===== AI ソリューション ===== */

export function AgentScreens() {
  return (
    <Stage label="社内の資料を参照して答え、重要な操作の前に承認を求めるAIエージェントの画面と、参照した資料のイメージ">
      <Win title="ai-agent / 業務アシスタント" className="mock-at-agent-win">
        <div className="mock-chat">
          <p className="mock-msg is-user">来月の発注量の案を作ってください。</p>
          <div className="mock-msg is-ai">
            <span className="mock-steps">
              <i>✓ 受注データを取得（12,480件）</i>
              <i>✓ 社内規程「発注基準」を参照</i>
            </span>
            上位3品目は前月比 +8% で案を作りました。
            <span className="mock-source">参照 2件</span>
          </div>
          <div className="mock-approve">
            <span>購買部へ送信しますか？</span>
            <span className="mock-btn">承認する</span>
          </div>
        </div>
      </Win>
      {/* RAG：答えの根拠にした社内資料。該当箇所に印を付ける */}
      <div className="mock-docs mock-at-agent-docs">
        <div className="mock-doc mock-shadow">
          <small>PDF</small>
          <b>発注基準 v3</b>
          <span className="mock-doc-lines"><i /><i /><i className="is-hit">在庫が2週間分を下回る品目は…</i><i /></span>
        </div>
        <div className="mock-doc mock-shadow">
          <small>表計算</small>
          <b>受注実績 2026-10</b>
          <span className="mock-doc-lines"><i /><i className="is-hit">上位3品目　前月比 +8%</i><i /><i /></span>
        </div>
      </div>
    </Stage>
  );
}

export function EnablementScreens() {
  const cols: [string, string, string[]][] = [
    ["自動化", "is-auto", ["問い合わせの一次回答", "議事録の要約・共有"]],
    ["AIと人で分担", "is-mix", ["見積書の下書き", "請求データの照合", "提案資料のたたき台"]],
    ["人が判断", "is-human", ["契約条件の判断", "値引きの可否"]],
  ];
  return (
    <Stage label="業務を付箋に書き出し、AIに任せる範囲と人が判断する範囲に貼り分けたワークショップのボードと、導入計画のイメージ">
      <div className="mock-board mock-shadow mock-at-enable-board">
        <div className="mock-row-between">
          <b className="mock-h">業務の棚卸し　営業部</b>
          <span className="mock-muted">ワークショップ 第2回</span>
        </div>
        <div className="mock-board-cols">
          {cols.map(([head, tone, notes]) => (
            <div key={head}>
              <span className={`mock-board-head ${tone}`}>{head}</span>
              {notes.map((n, i) => (
                <i key={n} className={`mock-note ${tone}`} style={{ rotate: `${[-2, 1.5, -1][i % 3]}deg` }}>
                  {n}
                </i>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mock-plan mock-shadow mock-at-enable-plan">
        <b className="mock-h">導入計画</b>
        <div className="mock-plan-row"><span>業務整理</span><span className="mock-plan-track"><i style={{ left: "0%", width: "34%" }} /></span></div>
        <div className="mock-plan-row"><span>小さく試す</span><span className="mock-plan-track"><i style={{ left: "30%", width: "38%" }} /></span></div>
        <div className="mock-plan-row"><span>社内展開</span><span className="mock-plan-track"><i className="is-dark" style={{ left: "62%", width: "38%" }} /></span></div>
        <div className="mock-plan-months"><span>1月</span><span>2月</span><span>3月</span></div>
      </div>
    </Stage>
  );
}

export function ProductScreens() {
  return (
    <Stage label="届いたメールの文章を、AIが項目に分けた案件カードと候補に変えるイメージ">
      <div className="mock-mailcard mock-shadow mock-at-product-mail">
        <div className="mock-mail-head">
          <small>受信　11/18 09:12</small>
          <b>【案件】物流システム開発（Java）2名</b>
        </div>
        <p>
          お世話になっております。下記の案件で要員を探しております。<br />
          言語：<mark>Java・Spring</mark>　期間：<mark>2月〜長期</mark><br />
          場所：<mark>リモート併用</mark>　人数：<mark>2名</mark><br />
          物流の業務経験がある方を歓迎します。
        </p>
      </div>
      <span className="mock-arrow mock-at-product-arrow">AI</span>
      <div className="mock-struct mock-shadow mock-at-product-struct">
        <div className="mock-row-between">
          <b className="mock-h">案件　物流システム</b>
          <span className="mock-tag">自動で構造化</span>
        </div>
        <div className="mock-fields">
          <span><small>言語</small>Java・Spring</span>
          <span><small>期間</small>2月〜</span>
          <span><small>場所</small>リモート併用</span>
          <span><small>人数</small>2名</span>
        </div>
        <div className="mock-match">
          {[
            ["候補 A", "92", "Java 7年・物流の経験あり"],
            ["候補 B", "85", "2月から参画できる"],
          ].map(([n, sc, why]) => (
            <div key={n}>
              <b>{n}</b>
              <span className="mock-score">{sc}</span>
              <small>{why}</small>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}
