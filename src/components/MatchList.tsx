import { type MatchDetail } from "@/types/nexon";

interface MatchListProps {
  matchDetails: MatchDetail[];
  ouid?: string;
  isLoading: boolean;
}

export function MatchList({ matchDetails, ouid, isLoading }: MatchListProps) {
  if (matchDetails.length === 0) {
    if (isLoading) return null;
    return (
      <p className="text-muted-foreground py-4 text-xs">
        해당 매치 타입의 경기 기록이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-3 border-t pt-3">
      <p className="text-muted-foreground text-xs font-semibold">
        최근 매치 기록
      </p>
      {matchDetails.map((match) => {
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
      })}
    </div>
  );
}
