import { getPlayerActionImage, getPlayerImage } from "@/utils/nexon";
import { useEffect, useState } from "react";

interface PlayerImageProps {
  spid?: number;
  name?: string;
  className?: string;
}

export function PlayerImage({ spid, name, className }: PlayerImageProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [errorStep, setErrorStep] = useState<number>(0);

  useEffect(() => {
    if (spid) {
      setImgSrc(getPlayerActionImage(spid));
      setErrorStep(0);
    } else {
      setImgSrc("/images/default_player.png");
    }
  }, [spid]);

  const handleError = () => {
    if (!spid) {
      setImgSrc("/images/default_player.png");
      return;
    }

    if (errorStep === 0) {
      setImgSrc(getPlayerImage(spid));
      setErrorStep(1);
    } else if (errorStep === 1) {
      setImgSrc("/images/default_player.png");
    }
  };

  return (
    <img
      src={imgSrc}
      alt={name || "player"}
      className={`object-contain ${className} w-20`}
      loading="lazy"
      onError={handleError}
    />
  );
}
