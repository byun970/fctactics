export interface PositionGridConfig {
  row: number;
  col: number;
  label: string;
}
export const POSITION_GRID_MAP: Record<number, PositionGridConfig> = {
  28: { row: 0, col: 0, label: "SUB" },
  0: { row: 3, col: 1, label: "GK" },

  // 수비수(DF)
  1: { row: 5, col: 1, label: "SW" },
  2: { row: 5, col: 1, label: "RCB" },
  3: { row: 6, col: 2, label: "RB" },
  4: { row: 4, col: 2, label: "RCB" },
  5: { row: 5, col: 5, label: "RWB" },
  6: { row: 3, col: 2, label: "LCB" },
  7: { row: 1, col: 2, label: "LB" },
  8: { row: 5, col: 1, label: "LB" },

  9: { row: 4, col: 3, label: "RDM" },
  10: { row: 4, col: 3, label: "CDM" },
  11: { row: 3, col: 3, label: "LDM" },
  12: { row: 1, col: 3, label: "LM" },
  13: { row: 3, col: 4, label: "LCM" },
  14: { row: 3, col: 2, label: "RCM" },
  15: { row: 3, col: 1, label: "LWM" },
  16: { row: 6, col: 3, label: "RM" },
  17: { row: 2, col: 3, label: "AM" },
  18: { row: 2, col: 4, label: "LAM" },
  19: { row: 2, col: 2, label: "RAM" },
  20: { row: 2, col: 5, label: "LM" },
  21: { row: 2, col: 1, label: "RM" },

  // 공격수 (FW)
  22: { row: 1, col: 5, label: "LW" },
  23: { row: 1, col: 1, label: "RW" },
  24: { row: 4, col: 5, label: "RS" },
  25: { row: 1, col: 2, label: "RF" },
  26: { row: 2, col: 5, label: "LS" },
  27: { row: 1, col: 3, label: "ST" },
};

export const DEFAULT_POSITION_CONFIG: PositionGridConfig = {
  row: 3,
  col: 3,
  label: "SUB",
};
