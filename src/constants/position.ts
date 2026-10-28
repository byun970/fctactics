export interface PositionGridConfig {
  x: number; // 0% (좌) ~ 100% (우)
  y: number; // 0% (상/ST) ~ 100% (하/GK)
  label: string;
}

export const POSITION_GRID_MAP: Record<number, PositionGridConfig> = {
  // 줄(GK·수비·수미·중미·공미·공격) 간격을 12% 이상 두어 모바일에서 카드가 겹치지 않게 함
  // GK & 수비수
  0: { x: 50, y: 93, label: "GK" },
  1: { x: 50, y: 85, label: "SW" },
  2: { x: 88, y: 66, label: "RWB" },
  3: { x: 84, y: 76, label: "RB" },
  4: { x: 66, y: 78, label: "RCB" },
  5: { x: 50, y: 78, label: "CB" },
  6: { x: 34, y: 78, label: "LCB" },
  7: { x: 16, y: 76, label: "LB" },
  8: { x: 12, y: 66, label: "LWB" },

  // 미드필더
  9: { x: 64, y: 64, label: "RDM" },
  10: { x: 50, y: 64, label: "CDM" },
  11: { x: 36, y: 64, label: "LDM" },
  12: { x: 86, y: 50, label: "RM" },
  13: { x: 68, y: 51, label: "RCM" },
  14: { x: 50, y: 51, label: "CM" },
  15: { x: 32, y: 51, label: "LCM" },
  16: { x: 14, y: 50, label: "LM" },

  // 공격형 미드필더 & 공격수
  17: { x: 64, y: 37, label: "RAM" },
  18: { x: 50, y: 37, label: "CAM" },
  19: { x: 36, y: 37, label: "LAM" },
  20: { x: 70, y: 24, label: "RF" },
  21: { x: 50, y: 24, label: "CF" },
  22: { x: 30, y: 24, label: "LF" },
  23: { x: 86, y: 12, label: "RW" },
  24: { x: 62, y: 11, label: "RS" },
  25: { x: 50, y: 10, label: "ST" },
  26: { x: 38, y: 11, label: "LS" },
  27: { x: 14, y: 12, label: "LW" },

  // 교체 선수
  28: { x: -1, y: -1, label: "SUB" },
};

export const DEFAULT_POSITION_CONFIG: PositionGridConfig = {
  x: -1,
  y: -1,
  label: "SUB",
};

export function getPositionColorClass(spPosition: number): string {
  if (spPosition === 0) return "bg-amber-500 text-black";
  if (spPosition >= 1 && spPosition <= 8) return "bg-blue-600 text-white";
  if (spPosition >= 9 && spPosition <= 19) return "bg-emerald-600 text-white";
  if (spPosition >= 20 && spPosition <= 27) return "bg-red-600 text-white";
  return "bg-slate-600 text-white";
}
