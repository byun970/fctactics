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
import { queryOptions, useQuery } from "@tanstack/react-query";

// 정적 메타데이터는 세션 동안 변하지 않음
const STATIC = { staleTime: Infinity, gcTime: Infinity } as const;

// spid.json 은 용량이 커서 페이지 로딩을 막지 않도록 별도 분리하고,
// 이름 맵 변환을 queryFn 에서 한 번만 수행해 캐시에 저장
export const spidNameMapQueryOptions = queryOptions({
  queryKey: ["spidNameMap"],
  queryFn: async () => {
    const data = await getSpidMeta();
    const map: Record<number, string> = {};
    for (const item of data) {
      if (item?.id) map[item.id] = item.name;
    }
    return map;
  },
  ...STATIC,
});

export function useSpidNameMap() {
  return useQuery(spidNameMapQueryOptions).data ?? {};
}

export function useNexonMetaData() {
  const matchTypesQuery = useQuery({
    queryKey: ["matchTypes"],
    queryFn: getMatchType,
    ...STATIC,
  });

  const sppositionMetaQuery = useQuery({
    queryKey: ["sppositionMap"],
    queryFn: async () => {
      const data = await getSppostionMeta();
      const map: Record<number, string> = {};
      for (const item of data) {
        if (item && typeof item.spposition === "number") {
          map[item.spposition] = item.desc;
        }
      }
      return map;
    },
    ...STATIC,
  });

  const divisionMetaQuery = useQuery({
    queryKey: ["divisionMeta"],
    queryFn: getDivisionMeta,
    ...STATIC,
  });

  return {
    matchTypes: matchTypesQuery.data ?? [],
    division: divisionMetaQuery.data ?? [],
    sppositionMap: sppositionMetaQuery.data ?? {},
    isMetaLoading:
      matchTypesQuery.isLoading ||
      sppositionMetaQuery.isLoading ||
      divisionMetaQuery.isLoading,
  };
}

// 경기 상세는 매치 ID 단위로 캐싱 (종료된 경기는 변하지 않음)
export function useMatchDetail(matchId: string) {
  return useQuery({
    queryKey: ["matchDetail", matchId],
    queryFn: () => getMatchDetail(matchId),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });
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
    staleTime: 1000 * 60,
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
    matchIds: matchIdsQuery.data ?? [],
    maxDivision: maxDivisionQuery.data ?? [],
    meta,
    isLoading:
      ouidQuery.isLoading ||
      matchIdsQuery.isLoading ||
      maxDivisionQuery.isLoading ||
      meta.isMetaLoading,
    isError:
      ouidQuery.isError || matchIdsQuery.isError || maxDivisionQuery.isError,
    error: ouidQuery.error || matchIdsQuery.error || maxDivisionQuery.error,
  };
}
