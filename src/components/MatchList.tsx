import { MatchItem } from "./MatchItem";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { spidNameMapQueryOptions } from "@/hooks/useUserMatches";

interface MatchListProps {
  matchIds: string[];
  ouid?: string;
  sppositionMap?: Record<number, string>;
}

const PAGE_SIZE = 5;

export function MatchList({ matchIds, ouid, sppositionMap }: MatchListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const queryClient = useQueryClient();

  // 스쿼드 펼칠 때 바로 보이도록 선수 이름 메타를 백그라운드에서 미리 로드
  useEffect(() => {
    queryClient.prefetchQuery(spidNameMapQueryOptions);
  }, [queryClient]);

  // 보이는 매치만 상세 정보를 요청
  const visibleIds = matchIds.slice(0, visibleCount);
  const hasMore = visibleCount < matchIds.length;

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + PAGE_SIZE);
  };

  if (matchIds.length === 0) {
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
      {visibleIds.map((matchId) => (
        <MatchItem
          key={matchId}
          matchId={matchId}
          ouid={ouid}
          sppositionMap={sppositionMap}
        />
      ))}

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
