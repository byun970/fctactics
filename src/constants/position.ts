export interface PositionGridConfig {
  x: number; // 0% (좌) ~ 100% (우)
  y: number; // 0% (상/ST) ~ 100% (하/GK)
  label: string;
}

export const POSITION_GRID_MAP: Record<number, PositionGridConfig> = {
  // GK & 수비수 (y: 80% ~ 95%)
  0: { x: 50, y: 92, label: "GK" },
  1: { x: 50, y: 84, label: "SW" },
  2: { x: 88, y: 72, label: "RWB" },
  3: { x: 82, y: 80, label: "RB" },
  4: { x: 63, y: 82, label: "RCB" },
  5: { x: 50, y: 82, label: "CB" },
  6: { x: 37, y: 82, label: "LCB" },
  7: { x: 18, y: 80, label: "LB" },
  8: { x: 12, y: 72, label: "LWB" },

  // 미드필더 (y: 35% ~ 68%)
  9: { x: 62, y: 68, label: "RDM" },
  10: { x: 50, y: 68, label: "CDM" },
  11: { x: 38, y: 68, label: "LDM" },
  12: { x: 85, y: 50, label: "RM" },
  13: { x: 65, y: 52, label: "RCM" },
  14: { x: 50, y: 52, label: "CM" },
  15: { x: 35, y: 52, label: "LCM" },
  16: { x: 15, y: 50, label: "LM" },

  // 공격형 미드필더 & 공격수 (y: 8% ~ 38%)
  17: { x: 63, y: 38, label: "RAM" },
  18: { x: 50, y: 38, label: "CAM" },
  19: { x: 37, y: 38, label: "LAM" },
  20: { x: 70, y: 25, label: "RF" },
  21: { x: 50, y: 25, label: "CF" },
  22: { x: 30, y: 25, label: "LF" },
  23: { x: 88, y: 12, label: "RW" },
  24: { x: 62, y: 10, label: "RS" },
  25: { x: 50, y: 8, label: "ST" },
  26: { x: 38, y: 10, label: "LS" },
  27: { x: 12, y: 12, label: "LW" },

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
