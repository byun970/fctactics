import type {
  DivisionMeta,
  MatchDetail,
  MatchTypeMeta,
  MaxDivision,
  PlayerMeta,
  PositionMeta,
} from "@/types/nexon";
import axios, { type InternalAxiosRequestConfig } from "axios";

const META_BASE_URL = "https://open.api.nexon.com/static/fconline/meta";
const MAX_RETRY = 3;

// API 키는 서버 프록시(개발: vite proxy, 배포: api/nexon.ts)에서 주입
export const nexonClient = axios.create({
  baseURL: "/api/fconline/v1",
});

// 429(요청 한도 초과) 시 지수 백오프로 재시도
nexonClient.interceptors.response.use(undefined, async (error) => {
  const config = error.config as
    | (InternalAxiosRequestConfig & { _retryCount?: number })
    | undefined;

  if (error.response?.status === 429 && config) {
    config._retryCount = (config._retryCount ?? 0) + 1;

    if (config._retryCount <= MAX_RETRY) {
      const waitTime = 2 ** config._retryCount * 500;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return nexonClient(config);
    }
  }
  return Promise.reject(error);
});

export const getOuid = async (nickname: string) => {
  const response = await nexonClient.get<{ ouid: string }>("/id", {
    params: { nickname },
  });
  return response.data;
};

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

export async function getMatchDetail(matchid: string): Promise<MatchDetail> {
  const response = await nexonClient.get("/match-detail", {
    params: { matchid },
  });
  return response.data;
}

export async function getMaxDivision(ouid: string): Promise<MaxDivision[]> {
  const response = await nexonClient.get("/user/maxdivision", {
    params: { ouid },
  });
  return response.data;
}

async function getMeta<T>(fileName: string): Promise<T> {
  const response = await axios.get<T>(`${META_BASE_URL}/${fileName}`);
  return response.data;
}

export const getMatchType = () => getMeta<MatchTypeMeta[]>("matchtype.json");
export const getSppostionMeta = () =>
  getMeta<PositionMeta[]>("spposition.json");
export const getDivisionMeta = () => getMeta<DivisionMeta[]>("division.json");
export const getSpidMeta = () => getMeta<PlayerMeta[]>("spid.json");
