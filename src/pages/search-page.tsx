import { getMatchDetail, getMatchIds, getOuid } from "@/api/nexonClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type MatchDetail } from "@/types/nexon";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function SearchPage() {
  const [nickname, setNickName] = useState<string>("");
  const [ouid, setOuid] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [matchDetails, setMatchDetails] = useState<MatchDetail[]>([]);
  const [error, setError] = useState<string | null>(null);
  async function fetchData(e: FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setOuid(null);

      const ouidData = await getOuid(nickname);
      const userOuid = ouidData.ouid;
      setOuid(userOuid);

      const matchIds = await getMatchIds(userOuid, 52, 0, 5);

      if (matchIds && matchIds.length > 0) {
        const details: MatchDetail[] = [];

        for (const id of matchIds) {
          const detail = await getMatchDetail(id);
          details.push(detail);
        }

        setMatchDetails(details);

        console.log(details);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError("존재하지 않는 구단주입니다.");
      } else {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }
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
          <form className="flex gap-2" onSubmit={fetchData}>
            <div className="relative flex-1">
              <Input
                placeholder="구단주명 입력"
                value={nickname}
                className="border-muted focus-visible:ring-primary/50 h-12 text-base shadow-none focus-visible:ring-2"
                onChange={(e) => setNickName(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button
              size="lg"
              disabled={loading}
              className="h-12 px-6 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              type="submit"
            >
              {loading ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-1.5 h-4 w-4" />
              )}
              검색
            </Button>
          </form>
        </div>
        {error && (
          <p className="text-destructive text-sm font-medium">{error}</p>
        )}
        {ouid && matchDetails.length > 0 && (
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
                      {myInfo?.matchDetail.goal ?? 0} :{" "}
                      {opponentInfo?.matchDetail.goal ?? 0}
                    </span>
                    <p className="text-muted-foreground">
                      {myInfo?.matchDetail.matchResult ?? "-"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
