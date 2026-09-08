import type {
  DivisionMeta,
  MatchDetail,
  MatchTypeMeta,
  MaxDivision,
  PositionMeta,
} from "@/types/nexon";
import axios from "axios";

export const nexonClient = axios.create({
  baseURL: "https://open.api.nexon.com/fconline/v1",
});

// 요청 직전에 API Key를 헤더에 주입 (환경 변수 누락 방지)
nexonClient.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_NEXON_API_KEY;
  if (apiKey) {
    config.headers["x-nxopen-api-key"] = apiKey;
  }
  return config;
});

// 1. ouid 조회
export const getOuid = async (nickname: string) => {
  // 1. URLSearchParams 객체를 생성하여 파라미터 세팅
  const params = new URLSearchParams();
  params.append("nickname", nickname.trim());

  // 2. params.toString()을 사용하여 URL 뒤에 직접 붙여 요청
  const response = await nexonClient.get<{ ouid: string }>(
    `/id?${params.toString()}`,
  );
  return response.data;
};
// 2. 매치 ID 목록 조회
export async function getMatchIds(
  ouid: string,
  matchtype: number = 52,
  offset: number = 0,
  limit: number = 20,
): Promise<string[]> {
  const response = await nexonClient.get("/user/match", {
    params: { ouid, matchtype, offset, limit },
  });
  return response.data;
}

// 3. 매치 상세 조회 (⚠️ 파라미터명을 matchid 소문자로 복구)
export async function getMatchDetail(matchid: string): Promise<MatchDetail> {
  const response = await nexonClient.get("/match", {
    params: { matchid },
  });
  return response.data;
}

export async function getMatchType(): Promise<MatchTypeMeta[]> {
  const response = await axios.get(
    "https://open.api.nexon.com/static/fconline/meta/matchtype.json",
  );
  return response.data;
}

export async function getMaxDivision(ouid: string): Promise<MaxDivision[]> {
  const response = await nexonClient.get("/user/maxdivision", {
    params: { ouid },
  });
  return response.data;
}

export async function getSppostionMeta(): Promise<PositionMeta[]> {
  const response = await axios.get(
    "https://open.api.nexon.com/static/fconline/meta/spposition.json",
  );
  return response.data;
}

export async function getDivisionMeta(): Promise<DivisionMeta[]> {
  const response = await axios.get(
    "https://open.api.nexon.com/static/fconline/meta/division.json",
  );
  return response.data;
}
