import Image from "next/image";
import { getLeader, type LeaderKey } from "@/lib/leaders";

/**
 * 事業ページの各領域に置く「この領域の責任者」（顔写真・氏名・役職の1行）。
 * 誰が見るのかを示すための小さな表示で、連絡先は載せない。写真は代表メッセージと同じ円形。
 */
export function FieldLead({ leader, label = "この領域の責任者" }: { leader: LeaderKey; label?: string }) {
  const l = getLeader(leader);
  return (
    <p className="mt-7 flex items-center gap-4 border-t border-line pt-5">
      <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line bg-white">
        <Image
          src={l.image}
          alt={`${l.name}の顔写真`}
          width={112}
          height={112}
          sizes="56px"
          className={`h-full w-full object-cover ${l.zoom ? "origin-[50%_35%] scale-110" : ""}`}
        />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-[0.06em] text-muted">{label}</span>
        <span className="flex flex-wrap items-baseline gap-x-3">
          <span className="text-[15px] font-bold text-ink">{l.name}</span>
          <span className="text-[12px] text-body">{l.title}</span>
        </span>
      </span>
    </p>
  );
}
