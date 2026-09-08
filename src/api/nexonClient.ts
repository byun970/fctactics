import type {
  DivisionMeta,
  MatchDetail,
  MatchTypeMeta,
  MaxDivision,
  PositionMeta,
} from "@/types/nexon";
import axios from "axios";

const NEXON_API_KEY = import.meta.env.VITE_NEXON_API_KEY;

export const nexonClient = axios.create({
  baseURL: "https://open.api.nexon.com/fconline/v1", // Vercel rewrite 대신 직접 호출하거나 CORS 시 relative path 유지
  headers: {
    "x-nxopen-api-key": NEXON_API_KEY,
  },
});

// 1. ouid 조회 (한글 닉네임 인코딩 필수)
export const getOuid = async (nickname: string) => {
  const encodedNickname = encodeURIComponent(nickname.trim());
  const response = await nexonClient.get<{ ouid: string }>(
    `/id?nickname=${encodedNickname}`,
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

// 3. 매치 상세 조회
export async function getMatchDetail(matchid: string): Promise<MatchDetail> {
  const response = await nexonClient.get("/match", {
    // ⚠️ 기존 /match-detail -> /match 로 수정 (넥슨 FC온라인 공식 Endpoint는 /match 입니다)
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
