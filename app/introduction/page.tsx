// URL・QRコードで案内する限定ページ。認証による閲覧制限ではない。
// noindex / nofollow を維持し、globalNav・footerNav・sitemap に追加しない。
// 出典：jqit-hearing の会社紹介・担当者欄、jqit-proposal の伴走支援・開発体制。
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import { certificationBadges, introductionContacts, siteConfig } from "@/lib/site-config";
import styles from "./introduction.module.css";

export const metadata: Metadata = {
  ...createPageMetadata({ title: "実績と開発体制のご紹介", description: "JQITの開発実績、4つの専門領域と責任者、導入の進め方、担当者の連絡先をご紹介します。", path: "/introduction" }),
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const leaders = [
  { field: "AI", title: "AIソリューション事業部長", name: "宮本 尚寛", image: "leader-miyamoto", scope: ["AIシステムの開発", "既存業務へのAI導入"], tech: ["Python", "FastAPI", "LLM API", "RAG"], crop: "miyamoto" },
  { field: "開発", title: "開発事業部長", name: "大野 健", image: "leader-ohno", scope: ["Web・モバイルアプリ", "設計から運用保守まで"], tech: ["Java", "TypeScript", "React", "Next.js"], crop: "ohno" },
  { field: "インフラ", title: "インフラ事業部長", name: "嵐 亮太", image: "leader-arashi", scope: ["オンプレ・クラウド基盤", "設計・構築・運用"], tech: ["AWS", "Azure", "オンプレミス"], crop: "arashi" },
  { field: "QA", title: "QA事業部長", name: "岩崎 顕儀", image: "leader-iwasaki", scope: ["品質保証・テスト設計", "テスト自動化"], tech: ["品質計画", "第三者検証", "自動化"], crop: "iwasaki" },
];

const cases = [
  { category: "教育機関向け", title: "いじめ対応支援AI", image: "ill-counsel", task: "相談内容の整理と報告", development: "相談の分析・報告書作成を支援するAI", output: "相談内容の分析結果・報告書", flow: ["相談内容", "AIによる分析", "報告書"] },
  { category: "営業業務向け", title: "営業リスト自動作成AI", image: "ill-saleslist", task: "日々の営業先の選定", development: "リスト自動作成・見込みのスコアリング", output: "営業リスト・成約見込みのスコア", flow: ["営業先の情報", "リスト化・評価", "営業リスト"] },
];

function ContactIcon({ phone = false }: { phone?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{phone ? <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z" /> : <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>}</svg>;
}

/** 工程を示す線画。文字はHTMLで表示して縮小時も読めるようにする。 */
function ProcessIcon({ step }: { step: number }) {
  return <svg className={styles.processIcon} width="72" height="72" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {step === 0 && <><path d="M10 12h34v27H25l-10 9v-9h-5z" /><path d="M24 45v6h20l10 8V25h-5" /><path d="M18 21h18M18 28h12" stroke="#e60012" /></>}
    {step === 1 && <><rect x="7" y="10" width="50" height="37" rx="3" /><path d="M3 54h58M25 22l-7 7 7 7m14-14 7 7-7 7" /><path d="m35 20-6 18" stroke="#e60012" /></>}
    {step === 2 && <><path d="M37 52H12V10h33v20M20 20h17M20 29h10M20 38h8" /><circle cx="44" cy="42" r="12" /><path d="m39 42 4 4 7-8" stroke="#e60012" /></>}
    {step === 3 && <><path d="M49 23A20 20 0 0 0 14 18l-4 10m0-13v13h13M15 41a20 20 0 0 0 35 5l4-10m0 13V36H41" /><path d="M24 34h7V23m0 11 10-10" stroke="#e60012" /></>}
  </svg>;
}

export default function IntroductionPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="#intro-top" aria-label="紹介ページの先頭へ" className={styles.logo}><Image src="/jqit-logo.png" alt="JQIT" width={425} height={118} priority /><span>実績と開発体制</span></a>
          <nav aria-label="紹介ページのナビゲーション" className={styles.headerNav}><a href="#projects">実績</a><a href="#team">開発体制</a><a href="#process">進め方</a></nav>
          <a className={styles.headerCta} href="#contacts">相談する <span aria-hidden="true">↓</span></a>
        </div>
      </header>
      <div className={styles.page} id="intro-top">
        <div className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>株式会社JQIT ／ ご相談いただく皆さまへ</p>
            <h1><span>ご相談から開発、</span><span>現場への定着まで。</span></h1>
            <p className={styles.lead}>AI・開発・インフラ・QAが連携。<br /><span>業務に合う仕組みをつくります。</span></p>
            <div className={styles.heroActions}><a className={styles.primaryLink} href="#projects">開発実績を見る <span aria-hidden="true">↓</span></a><a className={styles.textLink} href="#team">担当するチームを見る ↓</a></div>
          </div>
          <figure className={styles.heroProduct}>
            <Image src="/nova-product-2026-08c.png" alt="自社開発NOVAの案件一覧画面" width={1496} height={876} sizes="(max-width: 760px) 90vw, 45vw" loading="eager" />
            <figcaption><span>自社開発</span><strong>NOVA</strong><span>SES向けAIマッチング</span></figcaption>
          </figure>
        </div>
        <div className={styles.trustStrip}><p><strong>106名</strong><span>従業員数／2026年4月時点</span></p><p><strong>4つの専門領域</strong><span>AI・開発・インフラ・QA</span></p><p><strong>週1回の定例</strong><span>動くものを見ながら改善</span></p></div>

        <section className={styles.section} id="projects" aria-labelledby="projects-heading">
          <div className={styles.sectionHead}><p className={styles.eyebrow}>01 ／ 開発実績</p><h2 id="projects-heading"><span>業務の課題を</span><span>動く仕組みに。</span></h2></div>
          <article className={styles.featuredWork}>
            <div><p className={styles.eyebrow}>自社プロダクト ／ SES業界</p><h3>NOVA</h3><p className={styles.featuredLead}>案件と人材をつなぐ<br />AIマッチングサービス。</p><a className={styles.textLink} href={siteConfig.links.nova} target="_blank" rel="noopener noreferrer">NOVA製品サイト <span aria-hidden="true">↗</span><span className="sr-only">（新しいタブで開きます）</span></a></div>
            <div className={styles.productDetail}><ol className={styles.flow}>{["案件・人材を管理", "AIでマッチング", "候補を確認"].map((step) => <li key={step}>{step}</li>)}</ol><Image src="/nova-product-2026-08c.png" alt="NOVAの案件一覧。案件情報を一つの画面で確認できます" width={1496} height={876} sizes="(max-width: 760px) 90vw, 45vw" /></div>
          </article>
          <div className={styles.caseGrid}>{cases.map((work) => <article className={styles.case} key={work.title}>
            <div className={styles.caseVisual}><Image src={`/introduction/${work.image}.webp`} alt="" width={640} height={427} sizes="(max-width: 760px) 90vw, 45vw" /></div>
            <p className={styles.eyebrow}>{work.category}</p><h3>{work.title}</h3>
            <ol className={styles.flow}>{work.flow.map((step) => <li key={step}>{step}</li>)}</ol>
            <details className={styles.more}><summary aria-label={`${work.title}の開発内容を見る`}>開発内容を見る</summary><dl className={styles.facts}><div><dt>対象業務</dt><dd>{work.task}</dd></div><div><dt>開発内容</dt><dd>{work.development}</dd></div><div><dt>出力</dt><dd>{work.output}</dd></div></dl></details>
          </article>)}</div>
          <p className={styles.note}>画面は製品紹介用、イラストは用途のイメージです。</p>
        </section>

        <section className={styles.section} id="team" aria-labelledby="team-heading">
          <div className={styles.sectionHead}><p className={styles.eyebrow}>02 ／ 開発体制</p><h2 id="team-heading"><span>4つの専門領域が</span><span>連携します。</span></h2></div>
          <div className={styles.leaderGrid}>{leaders.map((leader) => <article className={styles.leader} key={leader.field}>
            <div className={styles.portrait} data-person={leader.crop}><Image src={`/introduction/${leader.image}.webp`} alt={leader.name} width={160} height={160} sizes="160px" /></div>
            <p className={styles.field}>{leader.field}</p><h3>{leader.name}</h3><p className={styles.jobTitle}>事業部長</p>
          </article>)}</div>
          <details className={styles.more}><summary>担当範囲・技術を見る</summary><div className={styles.expertise}>{leaders.map((leader) => <div key={leader.field}><h3>{leader.field}</h3><p>{leader.scope.join(" ／ ")}</p><p className={styles.note}>{leader.tech.join(" ／ ")}</p></div>)}</div></details>
          <div className={styles.projectTeam}><p className={styles.eyebrow}>案件の窓口</p><div className={styles.teamLinks}>{introductionContacts.members.map((person, i) => <a key={person.email} href={`#contact-${i}`}><span>{person.role}</span><strong>{person.name}</strong><span className={styles.teamArrow} aria-hidden="true">↓</span></a>)}</div></div>
          <aside className={styles.credentials} aria-label="JQITの認証・評価"><div className={styles.badges}>{certificationBadges.filter((badge) => badge.image).map((badge) => <figure key={badge.label}><Image src={badge.image!.src} alt={badge.label} width={badge.image!.width} height={badge.image!.height} sizes="(max-width: 760px) 40vw, 220px" /><figcaption>{badge.label.startsWith("2026年度") ? <>2026年度 財界<br /><span style={{ whiteSpace: "nowrap" }}>BEST AI 100</span></> : badge.label}</figcaption></figure>)}</div></aside>
        </section>

        <section className={styles.section} id="process" aria-labelledby="process-heading">
          <div className={styles.sectionHead}><p className={styles.eyebrow}>03 ／ 進め方</p><h2 id="process-heading"><span>小さく確かめ、</span><span>毎週の対話で改善する。</span></h2></div>
          <div className={styles.cycle}><div className={styles.cycleHead}><strong>週1回の定例会</strong><span>動くものを見ながら、一緒に確認。</span></div><ol className={styles.steps}>{["要件整理", "実装", "レビュー", "改善"].map((title, i) => <li key={title}><span className={styles.stepNumber}>0{i + 1}</span><ProcessIcon step={i} /><h3>{title}</h3></li>)}</ol><p className={styles.cycleReturn}><span aria-hidden="true">↶</span> 次の週も、確認と改善。</p></div>

        </section>

        <section className={styles.section} id="contacts" aria-labelledby="contacts-heading">
          <div className={styles.sectionHead}><p className={styles.eyebrow}>04 ／ 担当者・連絡先</p><h2 id="contacts-heading"><span>まずは、</span><span>お話を聞かせてください。</span></h2></div>
          <div className={styles.contactGrid}>{introductionContacts.members.map((person, i) => <article id={`contact-${i}`} className={styles.contact} key={person.email}>
            <p className={styles.eyebrow}>{person.role}</p><h3>{person.name}<span>{person.reading}</span></h3><p className={styles.jobTitle}>{person.title}</p>
            <a href={`mailto:${person.email}`}><ContactIcon /><span><small>メールを送る</small>{person.email}</span></a>
            {person.phone && <a href={`tel:${person.phone.replaceAll('-', '')}`}><ContactIcon phone /><span><small>電話する</small>{person.phone}</span></a>}
          </article>)}</div>
          <div className={styles.sharedContact}><div><strong>担当者が分からない方へ</strong><p>営業部共通窓口で承ります。</p></div><a href={`mailto:${introductionContacts.salesEmail}`}><ContactIcon />{introductionContacts.salesEmail}</a></div>
        </section>

        <footer className={styles.footer}><div><strong>{siteConfig.name}</strong><p>{siteConfig.address}</p><a href={siteConfig.telHref}>代表電話：{siteConfig.tel}</a></div><div><p>設立：{siteConfig.founded}年12月 ／ 資本金：{siteConfig.capital}</p><p>{siteConfig.certifications[4]}</p><div><Link href="/">JQITのホームページへ <span aria-hidden="true">→</span></Link></div><a href="/privacy-policy">プライバシーポリシー</a><small>© {new Date().getFullYear()} JQIT Co., Ltd.</small></div></footer>
      </div>
    </>
  );
}
