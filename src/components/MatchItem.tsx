import {
  type MatchDetail,
  type Player,
  type PositionMeta,
} from "@/types/nexon";
import { useState } from "react";
import { PlayerImage } from "./PlayerImage";
import {
  DEFAULT_POSITION_CONFIG,
  POSITION_GRID_MAP,
} from "@/constants/position";
import { FieldLayout } from "./FieldLayout";

interface MatchItemProps {
  match: MatchDetail;
  ouid?: string;
  sppositionMap?: Record<number, string>;
}

export function MatchItem({ match, ouid, sppositionMap }: MatchItemProps) {
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

  const actualMyPlayers: Player[] = myPlayers.filter(
    (player) => player.spPosition !== 28 && player.status,
  );

  const actualOppenentPlayers: Player[] = opponentPlayers.filter(
    (player) => player.spPosition !== 28 && player.status,
  );

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FieldLayout
            title={myInfo?.nickname ?? "내 스쿼드"}
            players={actualMyPlayers}
            sppositionMap={sppositionMap}
          />
          <FieldLayout
            title={opponentInfo?.nickname ?? "상대 스쿼드"}
            players={actualOppenentPlayers}
            sppositionMap={sppositionMap}
            isOpponent
          />
        </div>
      )}
    </>
  );
}
