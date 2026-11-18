import { Fragment } from "react";

/**
 * 「|」で区切った文節の切れ目でだけ改行させる（円の中など幅の狭い所で、語の途中で折り返さないように）。
 * 表示側の CSS で word-break: keep-all を指定しておくこと。
 */
export function Phrase({ text }: { text: string }) {
  return (
    <>
      {text.split("|").map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {part}
        </Fragment>
      ))}
    </>
  );
}

/** 区切り記号を外した、そのまま読む文字列 */
export const plainPhrase = (text: string) => text.replaceAll("|", "");
