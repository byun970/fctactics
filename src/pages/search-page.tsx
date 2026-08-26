import { MatchList } from "@/components/MatchList";
import { MatchModal } from "@/components/MatchModal";
import { MatchTypeFilter } from "@/components/MatchTypeFilter";
import { SearchForm } from "@/components/SearchForm";
import { useUserMatches } from "@/hooks/useUserMatches";
import { useSearchStore } from "@/stores/useSearchStore";
import axios from "axios";

export default function SearchPage() {
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

  const getErrorMessage = () => {
    if (!isError) return null;
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return "존재하지 않는 구단주입니다.";
    }
    return "데이터를 불러오는 중 오류가 발생했습니다.";
  };
  return (
    <div className="from-background via-muted/50 to-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            전적 검색
          </h2>
          <p className="text-muted-foreground text-sm">
            구단주명을 입력하고 전적 및 매치 기록을 확인하세요.
          </p>
        </div>

        <SearchForm isLoading={isLoading} />
        {isError && (
          <p className="text-destructive text-sm font-medium">
            {getErrorMessage()}
          </p>
        )}

        <MatchModal />
      </div>
    </div>
  );
}
