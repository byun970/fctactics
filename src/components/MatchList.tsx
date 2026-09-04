import type { MatchDetail, PositionMeta } from "@/types/nexon";
import { MatchItem } from "./MatchItem";
import { useState } from "react";
import { Button } from "./ui/button";

interface MatchListProps {
  matchDetails: MatchDetail[];
  ouid?: string;
  sppositionMap?: Record<number, string>;
}

const PAGE_SIZE = 5;

export function MatchList({
  matchDetails,
  ouid,
  sppositionMap,
}: MatchListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleMatches = matchDetails.slice(0, visibleCount);
  const hasMore = visibleCount < matchDetails.length;

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + PAGE_SIZE);
  };

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
      {visibleMatches.map((match) => {
        return (
          <MatchItem
            key={match.matchId}
            match={match}
            ouid={ouid}
            sppositionMap={sppositionMap}
          />
        );
      })}

      <div className="flex justify-center py-4">
        {hasMore && (
          <Button
            className="cursor-pointer bg-blue-500 hover:bg-blue-600"
            onClick={handleLoadMore}
          >
            더보기
          </Button>
        )}
      </div>
    </div>
  );
}
