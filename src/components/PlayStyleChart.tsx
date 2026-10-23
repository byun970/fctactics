import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { matchDetailQueryOptions } from "@/hooks/useUserMatches";

interface PlayStyleChartProps {
  matchIds: string[];
  ouid: string;
}

const rate = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 1000) / 10 : 0;

export function PlayStyleChart({ matchIds, ouid }: PlayStyleChartProps) {
  // MatchItem 과 같은 queryKey 를 사용하므로 추가 요청 없이 캐시를 공유
  const results = useQueries({
    queries: matchIds.map((id) => matchDetailQueryOptions(id)),
  });

  const loadedCount = results.filter((r) => r.data).length;

  const data = useMemo(() => {
    const total = {
      shoot: 0,
      effectiveShoot: 0,
      goal: 0,
      passTry: 0,
      passSuccess: 0,
      dribbleTry: 0,
      dribbleSuccess: 0,
      assist: 0,
      tackle: 0,
      block: 0,
      foul: 0,
      wins: 0,
      possession: 0,
      matches: 0,
    };

    for (const { data: match } of results) {
      const mine = match?.matchInfo.find((m) => m.ouid === ouid);
      if (!mine) continue;
      total.matches += 1;
      total.possession += mine.matchDetail?.possession ?? 0;
      total.foul += mine.matchDetail?.foul ?? 0;
      if (mine.matchDetail?.matchResult === "승") total.wins += 1;
      for (const player of mine.player ?? []) {
        if (!player.status) continue;
        total.shoot += player.status.shoot;
        total.effectiveShoot += player.status.effectiveShoot;
        total.goal += player.status.goal;
        total.passTry += player.status.passTry;
        total.passSuccess += player.status.passSuccess;
        total.dribbleTry += player.status.dribbleTry;
        total.dribbleSuccess += player.status.dribbleSuccess;
        total.assist += player.status.assist;
        total.tackle += player.status.tackle;
        total.block += player.status.block;
      }
    }

    if (total.matches === 0) return null;

    const avg = (v: number) => Math.round((v / total.matches) * 10) / 10;

    const bars = [
      { name: "유효슈팅률", value: rate(total.effectiveShoot, total.shoot) },
      { name: "골 결정력", value: rate(total.goal, total.shoot) },
      { name: "패스 성공률", value: rate(total.passSuccess, total.passTry) },
      {
        name: "드리블 성공률",
        value: rate(total.dribbleSuccess, total.dribbleTry),
      },
      {
        name: "평균 점유율",
        value: avg(total.possession),
      },
      { name: "승률", value: rate(total.wins, total.matches) },
    ];

    const stats = [
      { label: "경기당 득점", value: avg(total.goal) },
      { label: "경기당 도움", value: avg(total.assist) },
      { label: "경기당 슈팅", value: avg(total.shoot) },
      { label: "경기당 태클", value: avg(total.tackle) },
      { label: "경기당 블락", value: avg(total.block) },
      { label: "경기당 파울", value: avg(total.foul) },
    ];

    return { bars, stats };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedCount, ouid]);

  if (!data) return null;

  return (
    <div className="bg-muted/40 rounded-lg p-3">
      <p className="mb-2 text-sm font-bold">
        플레이 스타일{" "}
        <span className="text-muted-foreground text-[10px] font-normal">
          최근 {loadedCount}경기 기준
        </span>
      </p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.bars}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={11} />
            <YAxis domain={[0, 100]} unit="%" fontSize={11} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar
              dataKey="value"
              name="비율"
              fill="#10b981"
              radius={4}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {data.stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-background rounded-md p-2 text-center"
          >
            <p className="text-muted-foreground text-[10px]">{stat.label}</p>
            <p className="text-sm font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
