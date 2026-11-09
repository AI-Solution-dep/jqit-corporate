// URL・QRコードで手渡す隠れページ（認証による閲覧制限ではない）。
// noindex / nofollowを維持し、globalNav・footerNav・sitemapには追加しない。
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { cardUrl, findCard, publishedCards } from "@/lib/cards";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import introduction from "@/app/introduction/introduction.module.css";
import styles from "./card.module.css";
import { ShareCard } from "./ShareCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedCards().map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = findCard((await params).slug);
  if (!card) notFound();
  return {
    ...createPageMetadata({ title: `${card.name}の名刺`, description: `${siteConfig.name} ${card.title} ${card.department}`, path: `/card/${card.slug}` }),
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

export default async function CardPage({ params }: Props) {
  const card = findCard((await params).slug);
  if (!card) notFound();
  const url = cardUrl(card.slug);
  const qr = await QRCode.toDataURL(url, { width: 320, margin: 4, errorCorrectionLevel: "M", color: { dark: "#14140f", light: "#ffffff" } });

  return <div className={styles.page}>
    <div className={styles.sheet}>
      <header className={styles.header}><Image src="/jqit-logo.png" alt="JQIT" width={110} height={31} priority /></header>
      <article className={`${introduction.contact} ${styles.card}`} aria-labelledby="card-name">
        <div className={styles.identity}>
          <div className={styles.avatar} aria-hidden="true">{Array.from(card.name)[0]}</div>
          <div><p className={styles.company}>{siteConfig.name}</p><h1 id="card-name">{card.name}</h1><p className={styles.reading}>{card.reading}</p><p className={styles.english}>{card.nameEn}</p></div>
        </div>
        <p className={`${introduction.jobTitle} ${styles.title}`}>{card.title}　{card.department}</p>
        <div className={styles.actions}>
          {/* download属性は付けず、iPhoneで連絡先プレビューを開けるinline応答に遷移する。 */}
          <a className={introduction.primaryLink} href={`/card/${card.slug}/vcard`}>連絡先に追加</a>
          <a href={`mailto:${card.email}`}>メール</a>
          <a href={`tel:${card.mobile.replaceAll("-", "")}`}>電話</a>
        </div>
        <dl className={styles.details}>
          <div><dt>メール</dt><dd><a href={`mailto:${card.email}`}>{card.email}</a></dd></div>
          <div><dt>携帯</dt><dd><a href={`tel:${card.mobile.replaceAll("-", "")}`}>{card.mobile}</a></dd></div>
          <div><dt>会社</dt><dd><a href={siteConfig.telHref}>{siteConfig.tel}</a></dd></div>
          <div><dt>所在地</dt><dd>{siteConfig.addressLines.map(line => <span key={line}>{line}</span>)}</dd></div>
          <div><dt>Web</dt><dd><a href={siteConfig.url}>{siteConfig.url}</a></dd></div>
        </dl>
        <section className={styles.section} aria-labelledby="message-heading"><h2 id="message-heading">ひとこと</h2><p>{card.message}</p><ul className={styles.tags}>{card.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></section>
        <section className={styles.section} aria-labelledby="services-heading"><h2 id="services-heading">JQITができること</h2><dl className={styles.fields}>
          {[
            ["AI", "AIシステムの開発・既存業務へのAI導入"],
            ["開発", "Web・モバイルアプリ、設計から運用保守まで"],
            ["インフラ", "オンプレ・クラウド基盤の設計・構築・運用"],
            ["QA", "品質保証・テスト設計・テスト自動化"],
          ].map(([field, description]) => <div key={field}><dt>{field}</dt><dd>{description}</dd></div>)}
        </dl><Link className={introduction.textLink} href="/introduction">実績と開発体制を見る <span aria-hidden="true">→</span></Link></section>
        <section className={`${styles.section} ${styles.share}`} aria-labelledby="share-heading"><h2 id="share-heading">この名刺を共有</h2><ShareCard url={url} name={card.name} /><Image className={styles.qr} src={qr} alt={`${card.name}の名刺ページを開くQRコード`} width={160} height={160} unoptimized /></section>
      </article>
    </div>
  </div>;
}
