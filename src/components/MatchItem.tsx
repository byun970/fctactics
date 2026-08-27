import { type MatchDetail } from "@/types/nexon";

interface MatchItemProps {
  match: MatchDetail;
  ouid?: string;
}

export function MatchItem({ match, ouid }: MatchItemProps) {
  const myInfo = match.matchInfo.find((m) => m.ouid === ouid);
  const opponentInfo = match.matchInfo.find((m) => m.ouid !== ouid);
  return (
    <div
      key={match.matchId}
      className="bg-muted/40 flex items-center justify-between rounded-lg p-3 text-xs"
    >
      <div>
        <p className="font-bold">
          {myInfo?.nickname ?? "나"} vs
          {opponentInfo?.nickname ?? "상대"}
        </p>
        <p className="text-muted-foreground text-[10px]">
          {new Date(match.matchDate).toLocaleString()}
        </p>
      </div>
      <div className="text-right">
        <span className="text-sm font-bold">
          {myInfo?.shoot?.goalTotal ?? 0} :{" "}
          {opponentInfo?.shoot?.goalTotal ?? 0}
        </span>
        <p className="text-muted-foreground">
          {myInfo?.matchDetail.matchResult ?? "-"}
        </p>
      </div>
    </div>
  );
}
