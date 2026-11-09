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
  const [pending, setPending] = useState<"copy" | "share" | null>(null);
  const urlField = useRef<HTMLInputElement>(null);

  async function copyUrl() {
    if (pending) return;
    setPending("copy");
    try {
      await navigator.clipboard.writeText(url);
      setNotice("URLをコピーしました。");
    } catch {
      urlField.current?.focus();
      urlField.current?.select();
      setNotice("コピーできませんでした。URL欄を長押し、または選択して手動でコピーしてください。");
    } finally {
      setPending(null);
    }
  }

  async function share() {
    if (pending) return;
    setPending("share");
    try {
      await navigator.share({ title: `${name}｜株式会社JQIT`, url });
      setNotice("");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setNotice("共有できませんでした。「URLをコピー」をご利用ください。");
    } finally {
      setPending(null);
    }
  }

  return <>
    <label className="sr-only" htmlFor="card-url">名刺ページのURL</label>
    <input id="card-url" name="card-url" type="url" autoComplete="off" spellCheck={false} aria-describedby="card-share-status" className={styles.url} ref={urlField} value={url} readOnly onFocus={event => event.currentTarget.select()} />
    <div className={styles.shareActions}>
      <button type="button" disabled={pending !== null} aria-busy={pending === "copy"} onClick={copyUrl}>{pending === "copy" ? "コピー中…" : "URLをコピー"}</button>
      {canShare && <button type="button" disabled={pending !== null} aria-busy={pending === "share"} onClick={share}>{pending === "share" ? "共有中…" : "共有"}</button>}
    </div>
    <p id="card-share-status" className={styles.notice} role="status" aria-atomic="true">{notice}</p>
  </>;
}
