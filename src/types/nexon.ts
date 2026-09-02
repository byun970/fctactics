export interface MatchTypeMeta {
  matchtype: number;
  desc: string;
}

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
  player: Player[];
  shoot?: ShootInfo;
}

export interface Player {
  spId: number;
  spPosition: number;
  spGrade: number;
  status: IndividualPlayerStatus;
}

export interface IndividualPlayerStatus {
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
  matchCount?: number;
  rating?: number; // 선수 평점
}

export interface ShootInfo {
  effectiveShootTotal: number;
  goalFreekick: number;
  goalHeading: number;
  goalInPenalty: number;
  goalOutPenalty: number;
  goalPenaltyKick: number;
  goalTotal: number;
  goalTotalDisplay: number;
  ownGoal: number;
  shootFreekick: number;
  shootHeading: number;
  shootInPenalty: number;
  shootOutPenalty: number;
  shootOutScore: number;
  shootPenaltyKick: number;
  shootTotal: number;
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

export interface MaxDivision {
  matchType: number;
  division: number;
  achievementDate: string;
}
