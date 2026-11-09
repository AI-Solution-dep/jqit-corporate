"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import styles from "./card.module.css";

const subscribe = () => () => {};
const getShareSupport = () => typeof navigator.share === "function";
const getServerShareSupport = () => false;

/** 共有操作のみクライアントで処理。表示は紹介ページと同じボタン・罫線の構成。 */
export function ShareCard({ url, name }: { url: string; name: string }) {
  const canShare = useSyncExternalStore(subscribe, getShareSupport, getServerShareSupport);
  const [notice, setNotice] = useState("");
  const urlField = useRef<HTMLInputElement>(null);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setNotice("URLをコピーしました。");
    } catch {
      urlField.current?.focus();
      urlField.current?.select();
      setNotice("コピーできませんでした。URL欄を長押し、または選択して手動でコピーしてください。");
    }
  }

  async function share() {
    try {
      await navigator.share({ title: `${name}｜株式会社JQIT`, url });
      setNotice("");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setNotice("共有できませんでした。「URLをコピー」をご利用ください。");
    }
  }

  return <>
    <label className="sr-only" htmlFor="card-url">名刺ページのURL</label>
    <input id="card-url" className={styles.url} ref={urlField} value={url} readOnly onFocus={event => event.currentTarget.select()} />
    <div className={styles.shareActions}>
      <button type="button" onClick={copyUrl}>URLをコピー</button>
      {canShare && <button type="button" onClick={share}>共有</button>}
    </div>
    <p className={styles.notice} role="status">{notice}</p>
  </>;
}
