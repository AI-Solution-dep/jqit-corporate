import Image from "next/image";
import Link from "next/link";
import { getWorkDetail } from "@/lib/works";
import { plainTextFromHtml } from "@/lib/seo";
import styles from "./introduction.module.css";

// 2026-11-12時点の掲載済み実績本文から編集。契約形態・人数・数値成果は推測しない。
// 納品/利用状況、顧客表記、期間、体制は実績記事を参照し、サンプルは紹介しない。
const caseIntroductions = [
  {
    id: "school-ijime-ai-support",
    category: "教育機関の業務支援",
    title: "いじめ対応支援AI",
    image: "ill-counsel",
    challenge: "教員の経験差によって聞き取りの観点にばらつきがあり、記録と報告書の作成も負担になっていました。",
    scope: ["ガイドライン検索と聞き取り項目の生成", "音声記録の整理・報告書の出力", "氏名マスキング・利用者の権限分離"],
  },
  {
    id: "ai-agent-sales-list",
    category: "営業業務の自動化",
    title: "営業リスト自動作成AI",
    image: "ill-saleslist",
    challenge: "営業先を選ぶ基準が担当者の感覚に留まり、毎日20〜30件のリストを手作業で作成していました。",
    scope: ["収集項目とターゲットの評価基準を整理", "複数の情報源から収集し、4軸で評価", "評価した企業リストをExcelで出力"],
  },
] as const;

/** 発注の判断材料を、既存実績への入口で伝える。CMSへの書き込みは行わない。 */
export async function ProjectCases() {
  const records = await Promise.all(caseIntroductions.map(async introduction => ({ introduction, work: await getWorkDetail(introduction.id) })));
  const cases = records.flatMap(({ introduction, work }) => work && !work.isSample ? [{ introduction, work }] : []);
  if (!cases.length) return null;
  return <div className={styles.customerCases}>
    <p className={styles.customerCasesLabel}>お客さまの開発事例</p>
    <div className={styles.caseGrid}>{cases.map(({ introduction, work }) => {
      // スコア順の出力を、成約率の実測結果と誤認させない表現に整える。
      const result = plainTextFromHtml(work.result).replaceAll("成約確度の高い順に並んだ", "設定した基準で評価した");
      return <article className={styles.case} key={work.id}>
        <p className={styles.eyebrow}>{introduction.category}</p>
        <h3>{introduction.title}</h3>
        <dl className={styles.caseMeta}>
          <div><dt>お客さま</dt><dd>{work.client}</dd></div>
          {work.period && <div><dt>開発期間</dt><dd>{work.period}</dd></div>}
          {work.scale && <div><dt>開発体制</dt><dd>{work.scale}</dd></div>}
        </dl>
        <div className={styles.caseChallenge}><h4>お客さまの課題</h4><p>{introduction.challenge}</p></div>
        <div className={styles.caseVisual}><Image src={`/introduction/${introduction.image}.webp`} alt="" width={640} height={427} sizes="(max-width: 760px) 90vw, 45vw" /></div>
        <div className={styles.caseStory}>
          <div><h4>JQITが担当した開発</h4><ul>{introduction.scope.map(item => <li key={item}>{item}</li>)}</ul></div>
          {result && <div><h4>納品・利用状況</h4><p>{result}</p></div>}
        </div>
        <Link className={styles.caseDetailLink} href={`/works/${work.id}`}>{introduction.title}の事例を詳しく見る <span aria-hidden="true">→</span></Link>
        <a className={styles.caseConsultLink} href="#contacts">似た業務について相談する <span aria-hidden="true">↗</span></a>
      </article>;
    })}</div>
    <p className={styles.note}>イラストは用途のイメージです。</p>
  </div>;
}
