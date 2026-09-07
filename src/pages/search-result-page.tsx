import { useUserMatches } from "@/hooks/useUserMatches";
import { useSearchStore } from "@/stores/useSearchStore";
import { MatchTypeFilter } from "@/components/MatchTypeFilter";
import { Loader2 } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { MatchItem } from "@/components/MatchItem";
import { MatchList } from "@/components/MatchList";
import axios from "axios";
import type { DivisionMeta } from "@/types/nexon";
export function SearchResultPage() {
  const { nickname } = useParams<{ nickname: string }>();
  const decodedNickname = nickname ? decodeURIComponent(nickname) : "";
  const selectedMatchType = useSearchStore((state) => state.selectedMatchType);

  const {
    ouid,
    matchDetails = [],
    matchTypes = [],
    maxDivision = [],
    sppositionMap = [],
    division = [],
    isLoading,
    isError,
    error,
  } = useUserMatches(decodedNickname, selectedMatchType);

  console.log(division);

  const userMaxDivisionId = maxDivision[0]?.division;

  const matchedDivision = division.find(
    (item: DivisionMeta) => item.divisionId == userMaxDivisionId,
  );

  const divisionName = matchedDivision?.divisionName ?? "기록 없음";

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
        <div className="rounded-full p-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
        <p className="text-muted-foreground animate-pulse text-xs font-medium">
          결과 불러오는 중...
        </p>
      </div>
    );

  const getErrorMessage = () => {
    if (!isError) return null;
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return "존재하지 않는 구단주입니다.";
    }
    return error?.message ?? "데이터를 불러오는 중 오류가 발생했습니다.";
  };

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-4 text-center">
        <p className="text-destructive text-sm font-medium">
          {getErrorMessage()}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/">다시 검색하기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="text-xl font-bold">
          {decodedNickname}{" "}
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {divisionName}
          </span>
        </h1>
        <Button asChild variant="outline" size="sm">
          <Link to="/" className="text-muted-foreground text-xs">
            다시 검색
          </Link>
        </Button>
      </div>
      {ouid && <MatchTypeFilter matchTypes={matchTypes} />}
      <MatchList
        matchDetails={matchDetails}
        ouid={ouid}
        sppositionMap={sppositionMap}
      />
    </div>
  );
}
