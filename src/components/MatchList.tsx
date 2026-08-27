import type { MatchDetail } from "@/types/nexon";
import { MatchItem } from "./MatchItem";

interface MatchListProps {
  matchDetails: MatchDetail[];
  ouid?: string;
}

export function MatchList({ matchDetails, ouid }: MatchListProps) {
  if (matchDetails.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-xs">
        최근 매치 기록이 없습니다
      </p>
    );
  }

  return (
    <div className="space-y-3 border-t pt-3">
      <p className="text-muted-foreground text-xs font-semibold">
        최근 매치 기록
      </p>
      {matchDetails.map((match) => {
        return <MatchItem key={match.matchId} match={match} ouid={ouid} />;
      })}
    </div>
  );
}
