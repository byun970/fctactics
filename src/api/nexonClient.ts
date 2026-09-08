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
  baseURL: "https://open.api.nexon.com/fconline/v1",
  headers: {
    "x-nxopen-api-key": NEXON_API_KEY,
  },
});

// 1. ouid 조회 (axios params 이용)
export const getOuid = async (nickname: string) => {
  const response = await nexonClient.get<{ ouid: string }>("/id", {
    params: {
      nickname: nickname.trim(),
    },
  });
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

// 3. 매치 상세 조회 (matchId 대소문자 수정)
export async function getMatchDetail(matchid: string): Promise<MatchDetail> {
  const response = await nexonClient.get("/match", {
    params: { matchId: matchid }, // matchid -> matchId
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
