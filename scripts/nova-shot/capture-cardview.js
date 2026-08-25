// 現行NOVA（product_x フロント）の案件一覧・カード表示を、デモデータで描画して撮影する。
// 前提: product_x/frontend を `npm run dev -- -p 3200` で起動済み。バックエンドは不要（API応答をこのスクリプトが返す）。
// 使い方: NODE_PATH=<playwright入りnode_modules> node capture-cardview.js [出力png]
const { chromium } = require("playwright");
const path = require("path");
const OUT = process.argv[2] || path.join(__dirname, "source-projects-cards.png");
const BASE = "http://localhost:3200";
const SUPABASE_REF = "mwderapzymmrwhnlbaul"; // frontend/.env.local の NEXT_PUBLIC_SUPABASE_URL のプロジェクトref

// ---- デモデータ（product_x/backend/seed_demo_data.py と同じ架空の会社・案件） ----
// (タイトル, 会社, 技術領域, 勤務地, リモート, 予算下限, 予算上限, 外国籍可, 商流制限, 個人事業主可, [必須], [尚可])
const COMPANIES = ["株式会社ネクストフィールド", "サンライズテクノロジー株式会社", "株式会社ブルーポート", "みらいシステムズ株式会社", "株式会社アークライン"];
const SEED = [
  ["生成AI活用チャットボットの開発", 0, "開発", "港区（フルリモート可）", true, 70, 90, false, "1社先まで", true, ["Python", "生成AI", "AWS"], ["LangChain", "FastAPI"]],
  ["基幹システム刷新プロジェクト", 1, "開発", "新宿", false, 65, 80, false, "元請直", false, ["Java", "Spring Boot", "SQL"], ["Oracle", "詳細設計"]],
  ["ECサイトフロントエンド改修", 2, "開発", "渋谷（週2出社）", true, 60, 75, true, null, true, ["React", "TypeScript"], ["Next.js", "CSS"]],
  ["金融系バッチ処理の保守開発", 3, "開発", "大手町", false, 55, 70, false, "1社先まで", false, ["Java", "SQL"], ["Linux", "シェルスクリプト"]],
  ["AWSインフラ構築・移行支援", 0, "インフラ", "品川（リモート中心）", true, 75, 95, false, "元請直", true, ["AWS", "Terraform", "Linux"], ["Docker", "CI/CD"]],
  ["社内ネットワークの運用保守", 4, "インフラ", "豊洲", false, 50, 60, true, null, true, ["ネットワーク", "運用保守"], ["Cisco", "障害対応"]],
  ["Kubernetes基盤の構築", 1, "インフラ", "フルリモート", true, 80, 100, false, "1社先まで", true, ["Kubernetes", "Docker"], ["GCP", "CI/CD"]],
  ["決済システムのQA・テスト設計", 2, "QA", "田町", false, 55, 65, false, null, true, ["テスト設計", "QA"], ["Selenium", "JSTQB"]],
  ["スマホアプリのテスト自動化", 3, "QA", "五反田（リモート可）", true, 60, 70, true, null, true, ["テスト自動化", "Python"], ["Appium", "CI/CD"]],
  ["大規模プロジェクトのPMO支援", 4, "PMO", "丸の内", false, 70, 85, false, "元請直", false, ["PMO", "進捗管理"], ["課題管理", "資料作成"]],
  ["DX推進プロジェクトの管理", 0, "PMO", "神谷町（週3出社）", true, 75, 90, false, "1社先まで", true, ["PM", "要件定義"], ["ベンダーコントロール", "業務改善"]],
  ["ヘルプデスク・キッティング業務", 1, "その他", "川崎", false, 35, 45, true, null, true, ["ヘルプデスク", "Windows"], ["キッティング", "運用保守"]],
];
let tagSeq = 0;
const now = new Date();
const projects = SEED.map((r, i) => {
  const received = new Date(now.getTime() - (i + 1) * 86400000 - i * 2 * 3600000); // 1日ずつ古く（NEWバッジは出さない）
  received.setMinutes(34, 0, 0);
  return {
    id: `demo-${i + 1}`, title: r[0], company_name: COMPANIES[r[1]], description: null,
    status: "active", category: r[2], location: r[3], remote_ok: r[4],
    budget_min: r[5], budget_max: r[6], email_from: null, email_subject: `【案件情報】${r[0]}`,
    received_at: received.toISOString(), foreigner_allowed: r[7], freelance_allowed: r[9],
    business_flow_restriction: r[8], matching_count: 0, proposed_count: 0,
    created_at: received.toISOString(),
    tags: [...r[10].map((n) => ({ id: `t${++tagSeq}`, name: n, priority: "must" })),
           ...r[11].map((n) => ({ id: `t${++tagSeq}`, name: n, priority: "nice" }))],
  };
});

// ---- 擬似セッション（署名は検証されない。API応答はすべてこのスクリプトが返すため実トークンは不要） ----
const b64url = (o) => Buffer.from(JSON.stringify(o)).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
const expSec = Math.floor(now.getTime() / 1000) + 365 * 86400;
const user = { id: "00000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated", email: "demo@example.com",
  app_metadata: { provider: "email", tenant_id: "00000000-0000-4000-8000-0000000000aa" }, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" };
const jwt = `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url({ sub: user.id, aud: "authenticated", role: "authenticated", email: user.email, exp: expSec, iat: expSec - 3600 })}.demo`;
const session = { access_token: jwt, token_type: "bearer", expires_in: 3600 * 24 * 365, expires_at: expSec, refresh_token: "demo-refresh", user };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2, locale: "ja-JP", timezoneId: "Asia/Tokyo" });
  await ctx.addInitScript(({ key, sess }) => {
    localStorage.setItem(key, JSON.stringify(sess));
    localStorage.setItem("nova.projects.view", "card");
  }, { key: `sb-${SUPABASE_REF}-auth-token`, sess: session });

  // Supabase Auth への通信は遮断（擬似セッションのまま進める）
  await ctx.route(/supabase\.co\//, (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  // バックエンドAPIはすべてここで応答
  await ctx.route(/\/api\/v1\//, (r) => {
    const u = new URL(r.request().url()); const p = u.pathname.replace(/^.*\/api\/v1/, "");
    const json = (body) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
    if (p === "/projects") return json({ items: projects, total: projects.length });
    if (p === "/tags") return json({ items: [...new Set(projects.flatMap((x) => x.tags.map((t) => t.name)))].map((n, i) => ({ id: `tg${i}`, name: n })), total: 0 });
    if (p === "/profile") return json({ display_name: "デモ ユーザー", role_title: "営業", department: "営業部", phone: "", email_signature: "" });
    if (p === "/settings") return json({ tag_threshold: 50, run_ai_step: true });
    return json({ items: [], total: 0 });
  });

  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${BASE}/admin/projects`, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForSelector("article[role=button]", { timeout: 60000 });
  await page.addStyleTag({ content: "::-webkit-scrollbar{display:none} *{scrollbar-width:none}" });
  await page.waitForTimeout(1200);
  const cards = await page.locator("article[role=button]").count();
  console.log("url:", page.url(), "| cards:", cards, "| page errors:", errors.length ? errors.join(" / ").slice(0, 200) : "none");
  await page.screenshot({ path: OUT });
  await b.close();
  console.log("written:", OUT);
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });
