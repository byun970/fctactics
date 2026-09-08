import {
  getDivisionMeta,
  getMatchDetail,
  getMatchIds,
  getMatchType,
  getMaxDivision,
  getOuid,
  getSpidMeta,
  getSppostionMeta,
} from "@/api/nexonClient";
import type { MatchDetail } from "@/types/nexon";
import { useQuery } from "@tanstack/react-query";

export function useNexonMetaData() {
  const matchTypesQuery = useQuery({
    queryKey: ["matchTypes"],
    queryFn: getMatchType,
    staleTime: Infinity,
  });

  const sppositionMetaQuery = useQuery({
    queryKey: ["sppositionMeta"],
    queryFn: getSppostionMeta,
    staleTime: Infinity,
    select: (data) =>
      data?.reduce<Record<number, string>>((acc, item) => {
        if (item && typeof item.spposition === "number") {
          acc[item.spposition] = item.desc;
        }
        return acc;
      }, {}) ?? {},
  });

  const divisionMetaQuery = useQuery({
    queryKey: ["divisionMeta"],
    queryFn: getDivisionMeta,
    staleTime: Infinity,
  });

  const spidMetaQuery = useQuery({
    queryKey: ["spidMeta"],
    queryFn: getSpidMeta,
    staleTime: Infinity,
  });

  return {
    matchTypes: matchTypesQuery.data ?? [],
    division: divisionMetaQuery.data ?? [],
    spid: spidMetaQuery.data ?? [],
    sppositionMap: sppositionMetaQuery.data ?? {},
    isMetaLoading:
      matchTypesQuery.isLoading ||
      sppositionMetaQuery.isLoading ||
      divisionMetaQuery.isLoading ||
      spidMetaQuery.isLoading,
  };
}

export function useUserMatches(nickname: string, matchType: number = 50) {
  const meta = useNexonMetaData();

  const ouidQuery = useQuery({
    queryKey: ["ouid", nickname],
    queryFn: () => getOuid(nickname),
    enabled: !!nickname,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  const ouid = ouidQuery.data?.ouid;

  const matchIdsQuery = useQuery({
    queryKey: ["matchIds", ouid, matchType],
    queryFn: () => getMatchIds(ouid!, matchType, 0, 20),
    enabled: !!ouid,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const matchIds = matchIdsQuery.data ?? [];

  const matchDetailsQuery = useQuery({
    queryKey: ["matchDetails", matchIds.join(",")], // 참조값 대신 문자열 키 사용
    queryFn: async () => {
      const results: MatchDetail[] = [];

      for (const id of matchIds) {
        const detail = await getMatchDetail(id);
        results.push(detail);
        // 요청 간 100ms 강제 대기
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return results;
    },
    enabled: matchIds.length > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, // 탭 전환 시 자동 재요청으로 인한 429 방지
    retry: false,
  });

  const maxDivisionQuery = useQuery({
    queryKey: ["maxDivision", ouid],
    queryFn: () => getMaxDivision(ouid!),
    enabled: !!ouid,
    staleTime: 1000 * 60 * 10,
  });

  return {
    ouid,
    matchDetails: matchDetailsQuery.data ?? [],
    maxDivision: maxDivisionQuery.data ?? [],
    meta, // 메타데이터 일괄 반환
    isLoading:
      ouidQuery.isLoading ||
      matchIdsQuery.isLoading ||
      matchDetailsQuery.isLoading ||
      maxDivisionQuery.isLoading ||
      meta.isMetaLoading,
    isError:
      ouidQuery.isError ||
      matchIdsQuery.isError ||
      matchDetailsQuery.isError ||
      maxDivisionQuery.isError,
    error:
      ouidQuery.error ||
      matchIdsQuery.error ||
      matchDetailsQuery.error ||
      maxDivisionQuery.error,
  };
}
