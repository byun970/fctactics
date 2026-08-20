import axios from "axios";
import { useEffect, useState } from "react";
import { type PlayerMeta, type RankerStat } from "@/types/nexon";
import { nexonClient } from "@/api/nexonClient";

const formations = [
  { name: "4-2-3-1", winRate: "60.0%", pickRate: "42.8%" },
  { name: "4-2-2-2", winRate: "48.1%", pickRate: "30.8%" },
  { name: "5-2-3", winRate: "49.2%", pickRate: "15.8%" },
  { name: "4-1-2-3", winRate: "20.0%", pickRate: "10.8%" },
];

export default function IndexPage() {
  const [playerList, setPlayerList] = useState<PlayerMeta[]>([]);
  const [statList, setStatList] = useState<RankerStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const metaRes = await axios.get<PlayerMeta[]>(
          "/api/static/fconline/meta/spid.json",
        );
        setPlayerList(metaRes.data);

        const targetPlayers = metaRes.data.slice(0, 10).map((player) => ({
          id: player.id,
          po: 21,
        }));

        const encodedPlayers = encodeURIComponent(
          JSON.stringify(targetPlayers),
        );

        const rankerStats = await nexonClient.get<RankerStat[]>(
          "/ranker-stats",
          {
            params: {
              matchtype: 52,
              players: encodedPlayers,
            },
          },
        );
        setStatList(rankerStats.data);

        console.log(rankerStats.data);
      } catch (err) {
        console.error("오류 발생", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-5 text-center">데이터를 불러오는 중입니다...</div>;
  }

  const playerMap = new Map(playerList.map((p) => [p.id, p.name]));

  return (
    <>
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Top 10 랭커 사용 선수
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <tr>
                <th>선수명</th>
                <th>경기수</th>
                <th>득점</th>
                <th>어시스트</th>
                <th>유효슈팅 비율</th>
                <th>패스 비율</th>
                <th>패스 성공률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {statList.map((stat, idx) => {
                const playerName =
                  playerMap.get(stat.spid) || `선수 코드 (${stat.spid})`;
                const {
                  matchCount,
                  goal,
                  assist,
                  shoot,
                  effectiveShoot,
                  passTry,
                  passSuccess,
                } = stat.status;

                const shootEff =
                  shoot > 0
                    ? ((effectiveShoot / shoot) * 100).toFixed(1)
                    : "0.0";
                const passRate =
                  passTry > 0
                    ? ((passSuccess / passTry) * 100).toFixed(1)
                    : "0.0";

                return (
                  <tr
                    key={stat.spid ?? idx}
                    className="transition-colors duration-150 hover:bg-slate-50/80"
                  >
                    <td className="px-6-py-4 font-semibold whitespace-nowrap text-slate-900">
                      {playerName}
                    </td>
                    <td>{matchCount.toLocaleString()}</td>
                    <td>{goal.toLocaleString()}</td>
                    <td>{assist.toLocaleString()}</td>
                    <td>{shootEff}</td>
                    <td>{passRate}</td>
                    <td>{passSuccess.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
