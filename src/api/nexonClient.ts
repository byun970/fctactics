import type {
  DivisionMeta,
  MatchDetail,
  MatchTypeMeta,
  MaxDivision,
  PlayerMeta,
  PositionMeta,
} from "@/types/nexon";
import axios from "axios";

const NEXON_API_KEY = import.meta.env.VITE_NEXON_API_KEY;

export const nexonClient = axios.create({
  baseURL: "/api/fconline/v1",
  headers: {
    "x-nxopen-api-key": NEXON_API_KEY,
  },
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

export async function getSpidMeta(): Promise<PlayerMeta[]> {
  const response = await axios.get(
    "https://open.api.nexon.com/static/fconline/meta/spid.json",
  );
  return response.data;
}

export const nexonApi = axios.create({
  baseURL: "https://open.api.nexon.com", // 또는 설정하신 Proxy URL
});

nexonApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 429 && config) {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < 3) {
        config._retryCount += 1;

        const waitTime = Math.pow(2, config._retryCount) * 1000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        return nexonApi(config);
      }
    }
    return Promise.reject(error);
  },
);
