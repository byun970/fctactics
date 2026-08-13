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

// 2. 전체 매치 상세 데이터 타입
export interface MatchDetail {
  matchId: string;
  matchDate: string; // 날짜 표시용 필드 추가
  matchType: number;
  matchInfo: MatchInfo[]; // Array<{...}> 대신 MatchInfo 인터페이스 사용
}
