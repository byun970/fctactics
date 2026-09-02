const CDN_BASE_URL = "https://fco.dn.nexoncdn.co.kr/live/externalAssets/common";

const formatSpid = (spid: number | string): string => {
  return String(spid).padStart(9, "0");
};

const getPid = (spid: number | string): string => {
  const formatted = formatSpid(spid);
  return formatted.slice(-6);
};

export const getPlayerActionImage = (spid: number | string): string => {
  if (!spid) return "/images/default_player.png";
  const formattedSpid = formatSpid(spid);
  return `${CDN_BASE_URL}/playersAction/p${formattedSpid}.png`;
};

export const getPlayerImage = (spid: number | string): string => {
  if (!spid) return "/images/default_player.png";
  const formattedSpid = formatSpid(getPid(spid));
  return `${CDN_BASE_URL}/players/p${formattedSpid}.png`;
};
