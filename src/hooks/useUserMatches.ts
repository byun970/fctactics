import {
  getDivisionMeta,
  getMatchDetail,
  getMatchIds,
  getMatchType,
  getMaxDivision,
  getOuid,
  getSppostionMeta,
} from "@/api/nexonClient";
import type { MatchDetail } from "@/types/nexon";
import { useQuery } from "@tanstack/react-query";

export function useMatchType() {
  return useQuery({
    queryKey: ["matchTypes"],
    queryFn: getMatchType,
    staleTime: Infinity,
  });
}

export function useUserMatches(nickname: string, matchType: number = 50) {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const matchTypesQuery = useMatchType();

  // ouid 조회
  const ouidQuery = useQuery({
    queryKey: ["ouid", nickname],
    queryFn: () => getOuid(nickname),
    enabled: !!nickname, // 존재할 때만 실행
    staleTime: 1000 * 60 * 10, // 10분간 캐싱
    retry: false, // 400 에러 재시도 방지(존재하지 않는 유저)
  });

  const ouid = ouidQuery.data?.ouid;

  // 매치 아이디 목록 조회
  const matchIdsQuery = useQuery({
    queryKey: ["matchIds", ouid, matchType],
    queryFn: () => getMatchIds(ouid!, matchType, 0, 20),
    enabled: !!ouid, // ouid를 성공적으로 받아오면 실행
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const matchIds = matchIdsQuery.data ?? [];

  const matchDetailsQuery = useQuery({
    queryKey: ["matchDetails", matchIds],
    queryFn: async () => {
      const details: MatchDetail[] = [];
      for (const id of matchIds) {
        const detail = await getMatchDetail(id);
        details.push(detail);
        await delay(50); // 5개의 매치정보를 0.05초 간격을 두고 순차적으로 요청
      }
      return details;
    },
    enabled: matchIds.length > 0, // 매치 id 배열이 비어있지 않을 때만 실행
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) return false; // 429에러 시 즉시 중단
      return failureCount < 2; // 일반 에러-> 2회 재시도
    },
  });

  const maxDivisionQuery = useQuery({
    queryKey: ["maxDivision", ouid],
    queryFn: () => getMaxDivision(ouid!),
    enabled: !!ouid, //ouid가 확보된 후 요청 실행
    staleTime: 1000 * 60 * 10,
  });

  const sppositionMetaQuery = useQuery({
    queryKey: ["sppositionMeta"],
    queryFn: () => getSppostionMeta(),
    staleTime: Infinity,
    select: (data) =>
      data.reduce<Record<number, string>>((acc, item) => {
        acc[item.spposition] = item.desc;
        return acc;
      }, {}),
  });

  const divisionMetaQuery = useQuery({
    queryKey: ["divisionMeta"],
    queryFn: () => getDivisionMeta(),
    staleTime: Infinity,
  });

  return {
    ouid,
    matchDetails: matchDetailsQuery.data ?? [],
    matchTypes: matchTypesQuery.data ?? [],
    maxDivision: maxDivisionQuery.data ?? [],
    sppositionMap: sppositionMetaQuery.data ?? [],
    division: divisionMetaQuery.data ?? [],
    isLoading:
      ouidQuery.isLoading ||
      matchIdsQuery.isLoading ||
      matchDetailsQuery.isLoading || // 하나라도 로딩 발생시 true
      matchTypesQuery.isLoading ||
      maxDivisionQuery.isLoading ||
      sppositionMetaQuery.isLoading ||
      divisionMetaQuery.isLoading,
    isError:
      ouidQuery.isError ||
      matchIdsQuery.isError ||
      matchDetailsQuery.isError ||
      matchTypesQuery.isError ||
      maxDivisionQuery.isError ||
      sppositionMetaQuery.isError ||
      divisionMetaQuery.isError,
    error:
      ouidQuery.error ||
      matchIdsQuery.error ||
      matchDetailsQuery.error ||
      matchTypesQuery.error ||
      maxDivisionQuery.error ||
      sppositionMetaQuery.error ||
      divisionMetaQuery.error, // 하나라도 에러 발생시 true
  };
}
