export interface UserInfo {
  ouid: string;
  nickname: string;
  level: number;
}

export interface MatchDetail {
  matchId: string;
  matchType: number;
  matchInfo: Array<{
    ouid: string;
    nickname: string;
    matchDetail: {
      matchResult: string;
      foul: number;
      shoot: number;
      goal: number;
    };
  }>;
}
