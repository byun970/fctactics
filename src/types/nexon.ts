export interface PositionMeta {
  spposition: number;
  desc: string;
}

export interface PlayerMeta {
  id: number;
  name: string;
}

export interface UserInfo {
  ouid: string;
  nickname: string;
  level: number;
}

export interface MatchInfo {
  ouid: string;
  nickname: string;
  matchDetail: {
    matchResult: string;
    foul: number;
    shoot: number;
    goal: number;
    possession?: number;
    [key: string]: any;
  };
  shoot?: {
    shootTotal?: number;
    shootTotalDisplay?: number;
    effectiveShootTotal?: number;
    [key: string]: any;
  };
}

export interface MatchDetail {
  matchId: string;
  matchDate: string;
  matchType: number;
  matchInfo: MatchInfo[];
}

export interface PlayerStatus {
  shoot: number;
  effectiveShoot: number;
  assist: number;
  goal: number;
  dribble: number;
  dribbleTry: number;
  dribbleSuccess: number;
  passTry: number;
  passSuccess: number;
  block: number;
  tackle: number;
  matchCount: number;
}

export interface RankerStat {
  spid: number;
  spposition: number;
  status: PlayerStatus;
  createDate: string;
}
