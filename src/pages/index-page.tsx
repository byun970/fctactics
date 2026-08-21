import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { type PlayerMeta, type PositionMeta } from "@/types/nexon";

export default function IndexPage() {
  const [playerList, setPlayerList] = useState<PlayerMeta[]>([]);
  const [positionList, setPositionList] = useState<PositionMeta[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [playerMetaRes, positionMetaRes] = await Promise.all([
          axios.get<PlayerMeta[]>("/api/static/fconline/meta/spid.json"),
          axios.get<PositionMeta[]>(
            "/api/static/fconline/meta/spposition.json",
          ),
        ]);

        setPlayerList(playerMetaRes.data);
        setPositionList(positionMetaRes.data);

        console.log(playerList);
      } catch (err) {
        console.error("오류 발생", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  console.log(playerList);
  console.log(positionList);

  const playerMap = new Map(playerList.map((p) => [p.id, p.name]));
  const positionMap = useMemo(() => {
    return new Map(positionList.map((p) => [p.spposition, p.desc]));
  }, [positionList]);

  const groupedPlayers = useMemo(() => {
    const map = new Map<number, PlayerMeta[]>();

    playerList.forEach((player) => {
      const posId = (player as any).sppposition ?? 0;
      if (!map.has(posId)) {
        map.set(posId, []);
      }
      map.get(posId)!.push(player);
    });

    return map;
  }, [playerList]);

  console.log(groupedPlayers);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg font-medium text-gray-600">
          데이터를 불러오는 중 입니다..
        </div>
      </div>
    );
  }

  const filteredPositions =
    selectedPosition != null
      ? positionList.filter((p) => p.spposition === selectedPosition)
      : positionList;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="flex-2xl mb-6 flex font-bold">포지션별 선수 목록</h1>
    </div>
  );
}
