import type { MatchDetail } from "@/types/nexon";
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
  limit: number = 5,
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
