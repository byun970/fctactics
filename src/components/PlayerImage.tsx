import { getPlayerActionImage, getPlayerImage } from "@/utils/nexon";
import { useState } from "react";

const DEFAULT_PLAYER_IMAGE = "/images/default_player.png";

interface PlayerImageProps {
  spid?: number;
  name?: string;
  className?: string;
}

export function PlayerImage({ spid, name, className }: PlayerImageProps) {
  // 로드 실패 단계: 액션 이미지 → 기본 선수 이미지 → 대체 이미지
  const [failure, setFailure] = useState({ spid, step: 0 });
  const step = failure.spid === spid ? failure.step : 0;

  const sources = spid
    ? [getPlayerActionImage(spid), getPlayerImage(spid), DEFAULT_PLAYER_IMAGE]
    : [DEFAULT_PLAYER_IMAGE];
  const imgSrc = sources[Math.min(step, sources.length - 1)];

  const handleError = () => {
    if (step < sources.length - 1) setFailure({ spid, step: step + 1 });
  };

  return (
    <img
      src={imgSrc}
      alt={name || "player"}
      className={`object-contain ${className ?? "w-20"}`}
      loading="lazy"
      onError={handleError}
    />
  );
}
