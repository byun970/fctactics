import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserMatches } from "@/hooks/useUserMatches";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function SearchPage() {
  const [inputNickName, setInputNickName] = useState<string>(""); // input 창 텍스트 실시간 저장
  const [searchTarget, setSearchTarget] = useState<string>(""); // 검색 버튼을 눌렀을 때만 업데이트되는 실제 검색어
  const [selectedMatchType, setSelectedMatchType] = useState<number>(50);

  const {
    ouid,
    matchDetails = [],
    matchTypes = [],
    maxDivision = [],
    isLoading,
    isError,
    error,
  } = useUserMatches(searchTarget, selectedMatchType);

  console.log(maxDivision);

  async function handSubmit(e: FormEvent) {
    e.preventDefault();
    if (!inputNickName.trim()) return;
    setSearchTarget(inputNickName.trim());
  }

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

        <div className="bg-card/80 rounded-2xl border p-3 shadow-lg backdrop-blur-sm sm:p-4">
          <form className="flex gap-2" onSubmit={handSubmit}>
            <div className="relative flex-1">
              <Input
                placeholder="구단주명 입력"
                value={inputNickName}
                className="border-muted focus-visible:ring-primary/50 h-12 text-base shadow-none focus-visible:ring-2"
                onChange={(e) => setInputNickName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              size="lg"
              disabled={isLoading}
              className="h-12 px-6 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-1.5 h-4 w-4" />
              )}
              검색
            </Button>
          </form>
        </div>
        {isError && (
          <p className="text-destructive text-sm font-medium">
            {getErrorMessage()}
          </p>
        )}

        <div className="space-y-4 border-t pt-4">
          {Array.isArray(matchTypes) && matchTypes.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-1.5">
              {matchTypes.map((type: { matchtype: number; desc: string }) => (
                <Button
                  key={type.matchtype}
                  variant={
                    selectedMatchType === type.matchtype ? "default" : "outline"
                  }
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedMatchType(type.matchtype)}
                >
                  {type.desc}
                </Button>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>

        {matchDetails.length > 0 ? (
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
        ) : (
          !isLoading && (
            <p className="text-muted-foreground py-4 text-xs">
              해당 매치 타입의 경기 기록이 없습니다.
            </p>
          )
        )}
      </div>
    </div>
  );
}
