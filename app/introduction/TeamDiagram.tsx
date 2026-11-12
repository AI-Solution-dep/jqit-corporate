import { introductionContacts } from "@/lib/site-config";
import styles from "./team-diagram.module.css";

function CustomerDrawing() {
  return <svg viewBox="0 0 180 140" className={styles.customerDrawing} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M55 116V29l66-12v99M42 116h98M70 116V94h33v22M67 47h9m15-4h12M67 63h9m15-3h12M67 79h9m15-2h12" />
    <path d="M55 30l66-12v10L55 40Z" fill="#e60012" stroke="none" />
    <path d="M133 35h32v23h-12l-9 8v-8h-11ZM141 43h16m-16 7h10" stroke="#e60012" />
    <circle cx="30" cy="80" r="8" /><path d="M16 109V99a14 14 0 0 1 28 0v10M23 108v14m14-14v14" />
    <path d="M8 130c39-6 98-5 145-1" stroke="#d8b6bd" />
  </svg>;
}
function RoleDrawing({ index }: { index: number }) {
  return <svg className={styles.roleDrawing} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="20" cy="15" r="7" /><path d="M7 39v-5a13 13 0 0 1 26 0v5" />
    {index === 0 && <path d="M32 7h12v12h-5l-6 5v-5h-1M36 12h5" stroke="#e60012" />}
    {index === 1 && <path d="m32 8 4 3 7-7M34 27h10m-5-5v10" stroke="#e60012" />}
    {index === 2 && <path d="m35 9-4 5 4 5m6-10 4 5-4 5" stroke="#e60012" />}
  </svg>;
}
function FieldDrawing({ index }: { index: number }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {index === 0 && <><rect x="8" y="8" width="16" height="16" rx="3" /><path d="M12 4v4m8-4v4m-8 16v4m8-4v4M4 12h4m-4 8h4m16-8h4m-4 8h4M12 16h8m-4-4v8" /></>}
    {index === 1 && <><path d="m10 9-7 7 7 7m12-14 7 7-7 7M18 6l-4 20" /></>}
    {index === 2 && <><rect x="6" y="4" width="20" height="10" rx="2" /><rect x="6" y="18" width="20" height="10" rx="2" /><path d="M10 9h1m4 0h7m-12 14h1m4 0h7" /></>}
    {index === 3 && <><path d="M16 3 27 8v8c0 7-7 11-11 13C12 27 5 23 5 16V8zM10 16l4 4 8-9" /></>}
  </svg>;
}

/** 顧客との往復、担当者の役割、専門チームの連携を一枚で示す。 */
export function TeamDiagram() {
  return <figure className={styles.diagram} aria-label="お客さま・担当者・専門チームの連携体制">
    <div className={styles.map}>
      <div className={styles.customer}>
        <CustomerDrawing />
        <div><h3>お客さま</h3><p>課題・目標・現場の声</p></div>
      </div>
      <div className={styles.exchange}>
        <span>相談・共有</span>
        <svg viewBox="0 0 90 46" fill="none" aria-hidden="true"><path d="M3 12h80m-9-8 9 8-9 8M87 34H7m9-8-9 8 9 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span>提案・報告</span>
      </div>
      <div className={styles.jqit}>
        <p className={styles.teamLabel}>JQITの担当チーム</p>
        <div className={styles.people}>{introductionContacts.members.map((person, index) => <a key={person.email} href={`#contact-${index}`}>
          <RoleDrawing index={index} />
          <span className={styles.role}>{person.role}</span><strong>{person.name}</strong><small>{person.scope}</small>
          <span className={styles.arrow} aria-hidden="true">↗</span>
        </a>)}</div>
        <div className={styles.expertBridge}><span aria-hidden="true">↓ ↑</span><p>方針・仕様を共有し、<br className={styles.mobileBreak} />専門領域から検証</p></div>
        <div className={styles.fields}>{["AI", "開発", "インフラ", "QA"].map((field, index) => <div key={field}><FieldDrawing index={index} /><span>{field}</span></div>)}</div>
      </div>
    </div>
    <figcaption>窓口と専門チームが連携し、設計・開発から品質確認・運用まで。</figcaption>
  </figure>;
}
