"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** 自動で流れる丸だけを止める。スクロール操作に追従する演出とは分ける。 */
export function FlowAnimationControl() {
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const sync = () => {
      const onHome = Boolean(document.querySelector("[data-home-entrance]"));
      document.documentElement.dataset.flowControls = onHome && window.scrollY < 80 ? "hidden" : "visible";
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      window.removeEventListener("scroll", sync);
      delete document.documentElement.dataset.flowControls;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.flowPaused = String(paused);
    return () => { delete document.documentElement.dataset.flowPaused; };
  }, [paused]);

  if (!mounted) return null;
  return createPortal(
    <button
      type="button"
      className="flow-animation-control"
      aria-pressed={paused}
      onClick={() => setPaused(value => !value)}
    >
      <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
      {paused ? "丸の動きを再開" : "丸の動きを止める"}
    </button>,
    document.body,
  );
}
