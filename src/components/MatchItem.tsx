import { type MatchDetail, type Player } from "@/types/nexon";
import { useState } from "react";
import { PlayerImage } from "./PlayerImage";

interface MatchItemProps {
  match: MatchDetail;
  ouid?: string;
}

export function MatchItem({ match, ouid }: MatchItemProps) {
  const myInfo =
    match.matchInfo.find((m) => m.ouid === ouid) ?? match.matchInfo[0];
  const opponentInfo = match.matchInfo.find((m) => m.ouid !== ouid);
  const myPlayers: Player[] =
    (myInfo as any)?.player ?? (myInfo as any)?.players ?? [];
  const opponentPlayers: Player[] = opponentInfo?.player ?? [];
  const [hasClicked, setHasClicked] = useState(false);

  const resultConfig: Record<string, { label: string; color: string }> = {
    승: { label: "승", color: "text-green-500" },
    패: { label: "패", color: "text-red-500" },
    무: { label: "무", color: "text-gray-500" },
  };

  const result = myInfo?.matchDetail?.matchResult;
  const currentResult = result ? resultConfig[result] : null;

  console.log("전달받은 ouid: ", ouid);
  console.log(
    "매치 내 ouid 목록: ",
    match.matchInfo.map((m) => m.ouid),
  );
  console.log("나의 정보: ", myInfo);
  console.log("myplayers 배열: ", myPlayers);

  return (
    <>
      <div
        key={match.matchId}
        className="bg-muted/40 flex items-center justify-between rounded-lg p-3 text-lg"
        onClick={() => setHasClicked(!hasClicked)}
      >
        <div>
          <p className="font-bold">
            {myInfo?.nickname ?? "나"} vs {opponentInfo?.nickname ?? "상대"}
          </p>
          <p className="text-muted-foreground text-[10px]">
            {new Date(match.matchDate).toLocaleString()}
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
        <div>
          {myPlayers.map((player, idx) => (
            <div
              key={`${player.spId}-${idx}`}
              className="flex items-center gap-2"
            >
              <PlayerImage spid={player.spId} />
              <p>{player.spGrade}</p>
              <p>{player.status.goal}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
