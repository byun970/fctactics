export const getPositionCategory = (spposition: number): string => {
  if (spposition === 0) return "GK";
  if (spposition >= 1 && spposition <= 8) return "DF";
  if (spposition >= 9 && spposition <= 19) return "MF";
  if (spposition >= 20 && spposition <= 27) return "FW";
  if (spposition == 28) return "SUB";
  return "Unknown";
};

export const getPositionCategoryKo = (spposition: number): string => {
  const category = getPositionCategory(spposition);
  const categoryMap: Record<string, string> = {
    FW: "공격수",
    MF: "미드필더",
    DF: "수비수",
    GK: "골키퍼",
    SUB: "교체선수",
  };

  return categoryMap[category] || "기타";
};
