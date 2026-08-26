import { useUserMatches } from "@/hooks/useUserMatches";
import { useSearchStore } from "@/stores/useSearchStore";
import { MatchTypeFilter } from "./MatchTypeFilter";

export function MatchList() {
  const searchTarget = useSearchStore((state) => state.searchTarget);
  const selectedMatchType = useSearchStore((state) => state.selectedMatchType);

  const {
    ouid,
    matchDetails = [],
    matchTypes = [],
    maxDivision = [],
    isLoading,
    isError,
    error,
  } = useUserMatches(searchTarget, selectedMatchType);

  if (isLoading) return null;

  if (isError) {
    return (
      <p className="text-destructive py-4 text-xs">
        {error?.message ?? "경기 기록을 불러오는 중 오류가 발생했습니다."}
      </p>
    );
  }

  return (
    <>
      {ouid && <MatchTypeFilter matchTypes={matchTypes} />}
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
    </>
  );
}
