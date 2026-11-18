import Image from "next/image";
import { Fragment } from "react";
import { getLeader, type LeaderKey } from "@/lib/leaders";

/**
 * 事業ページで「誰が見るのか」を示す1行（顔写真を重ねて並べ、文で紹介する）。
 * 領域ごとに同じ部品を繰り返さない（判で押したように見えるため）。1ページに1回、節の冒頭に置く。
 * 連絡先は載せない。写真は代表メッセージと同じ円形。
 */
export function LeadsLine({ leaders, intro = "責任者は、" }: { leaders: LeaderKey[]; intro?: string }) {
  const people = leaders.map(getLeader);
  return (
    <p className="flex flex-col gap-4 min-[600px]:flex-row min-[600px]:items-center min-[600px]:gap-5">
      <span className="flex shrink-0">
        {people.map((l, i) => (
          <span
            key={l.key}
            className={`block h-14 w-14 overflow-hidden rounded-full border-2 border-white bg-white ${i > 0 ? "-ml-3" : ""}`}
          >
            <Image
              src={l.image}
              alt=""
              width={112}
              height={112}
              sizes="56px"
              className={`h-full w-full object-cover ${l.zoom ? "origin-[50%_35%] scale-110" : ""}`}
            />
          </span>
        ))}
      </span>
      <span className="text-[14px] leading-[1.9] text-body">
        {intro}
        {people.map((l, i) => (
          <Fragment key={l.key}>
            {people.length > 1 ? `${l.field}が` : `${l.title}の`}
            <strong className="whitespace-nowrap font-bold text-ink">{l.name}</strong>
            {i < people.length - 1 ? "、" : "です。"}
          </Fragment>
        ))}
      </span>
    </p>
  );
}
