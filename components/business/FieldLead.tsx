import Image from "next/image";
import { getLeader, type LeaderKey } from "@/lib/leaders";

/**
 * 事業ページで「誰が見るのか」を示す1行（顔写真を重ねて並べ、文で紹介する）。
 * 領域ごとに同じ部品を繰り返さない（判で押したように見えるため）。1ページに1回、節の冒頭に置く。
 * 連絡先は載せない。写真は代表メッセージと同じ円形。
 */
export function LeadsLine({ leaders }: { leaders: LeaderKey[] }) {
  const people = leaders.map(getLeader);
  return (
    <p className="flex flex-col gap-4 min-[600px]:flex-row min-[600px]:items-center min-[600px]:gap-5">
      <span className="flex shrink-0">
        {people.map((l, i) => (
          <span
            key={l.key}
            className={`block h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-white ${i > 0 ? "-ml-2" : ""}`}
          >
            <Image
              src={l.image}
              alt=""
              width={80}
              height={80}
              sizes="40px"
              className={`h-full w-full object-cover ${l.zoom ? "origin-[50%_35%] scale-110" : ""}`}
            />
          </span>
        ))}
      </span>
      <span className="text-[14px] leading-[1.9] text-body">
        {/* 氏名は出さない（オーナー判断）。領域と役職だけで示す */}
        {people.length > 1
          ? `${people.map((l) => l.field).join("・")}それぞれの事業部長が、責任を持って担当します。`
          : `${people[0].title}が、責任を持って担当します。`}
      </span>
    </p>
  );
}
