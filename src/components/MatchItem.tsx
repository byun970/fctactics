import { type Player } from "@/types/nexon";
import { useState } from "react";
import { formatKstDate } from "@/utils/date";
import { FieldLayout } from "./FieldLayout";
import { useMatchDetail } from "@/hooks/useUserMatches";

interface MatchItemProps {
  matchId: string;
  ouid?: string;
  sppositionMap?: Record<number, string>;
}

const RESULT_CONFIG: Record<string, { label: string; color: string }> = {
  승: { label: "승", color: "text-green-500" },
  패: { label: "패", color: "text-red-500" },
  무: { label: "무", color: "text-gray-500" },
};

// spPosition 기반 교체 선수 제외는 FieldLayout 에서 처리
const hasStatus = (player: Player) => !!player.status;

export function MatchItem({ matchId, ouid, sppositionMap }: MatchItemProps) {
  const { data: match, isLoading, isError } = useMatchDetail(matchId);
  const [hasClicked, setHasClicked] = useState(false);

  if (isLoading) {
    return <div className="bg-muted/40 h-[60px] animate-pulse rounded-lg" />;
  }

  if (isError || !match) {
    return (
      <div className="bg-muted/40 text-muted-foreground rounded-lg p-3 text-xs">
        경기 정보를 불러오지 못했습니다.
      </div>
    );
  }

  const myInfo =
    match.matchInfo.find((m) => m.ouid === ouid) ?? match.matchInfo[0];
  const opponentInfo = match.matchInfo.find((m) => m.ouid !== ouid);
  const myPlayers: Player[] = myInfo?.player ?? [];
  const opponentPlayers: Player[] = opponentInfo?.player ?? [];

  const result = myInfo?.matchDetail?.matchResult;
  const currentResult = result ? RESULT_CONFIG[result] : null;

  return (
    <>
      <div
        className="bg-muted/40 flex cursor-pointer items-center justify-between rounded-lg p-3 text-lg"
        onClick={() => setHasClicked(!hasClicked)}
      >
        <div>
          <p className="font-bold">
            {myInfo?.nickname ?? "나"} vs {opponentInfo?.nickname ?? "상대"}
          </p>
          <p className="text-muted-foreground text-[10px]">
            {formatKstDate(match.matchDate)}
          </p>
        </div>
        <div className="text-right text-lg">
          <span className="font-bold">
            {myInfo?.shoot?.goalTotal ?? 0} :{" "}
            {opponentInfo?.shoot?.goalTotal ?? 0}
          </span>
          {currentResult && (
            <span className={`ml-2 font-bold ${currentResult.color}`}>
              {currentResult.label}
            </span>
          )}
        </div>
      </div>

      {hasClicked && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FieldLayout
            title={myInfo?.nickname ?? "내 스쿼드"}
            players={myPlayers.filter(hasStatus)}
            sppositionMap={sppositionMap}
          />
          <FieldLayout
            title={opponentInfo?.nickname ?? "상대 스쿼드"}
            players={opponentPlayers.filter(hasStatus)}
            sppositionMap={sppositionMap}
            isOpponent
          />
        </div>
      )}
    </>
  );
}
