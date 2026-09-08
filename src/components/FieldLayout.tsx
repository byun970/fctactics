import type { Player } from "@/types/nexon";
import { PlayerImage } from "./PlayerImage";
import {
  DEFAULT_POSITION_CONFIG,
  POSITION_GRID_MAP,
  getPositionColorClass,
} from "@/constants/position";
import { useNexonMetaData } from "@/hooks/useUserMatches";
import { useMemo } from "react";

interface FieldLayoutProps {
  title: string;
  players: Player[];
  sppositionMap?: Record<number, string>;
  isOpponent?: boolean;
}

export function FieldLayout({
  title,
  players,
  sppositionMap,
  isOpponent = false,
}: FieldLayoutProps) {
  const mainPlayers = players.filter((p) => p.spPosition !== 28);

  const { spid = [] } = useNexonMetaData();

  const spidNameMap = useMemo(() => {
    return spid.reduce<Record<number, string>>((acc, item) => {
      if (item && item.id) {
        acc[item.id] = item.name;
      }
      return acc;
    }, {});
  }, [spid]);

  const ratings = mainPlayers
    .map((p) => Number(p.status?.spRating ?? 0))
    .filter((r) => !isNaN(r));

  const maxRating = ratings.length > 0 ? Math.max(...ratings) : 1;
  const minRating = ratings.length > 0 ? Math.min(...ratings) : 1;

  const hasRatingDiff = maxRating !== minRating;

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-muted-foreground text-center text-sm font-semibold">
        {title}
      </h4>

      <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl border-2 border-emerald-600/60 bg-emerald-800 p-2 shadow-inner">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full stroke-white/30"
          strokeWidth="1.5"
          fill="none"
          viewBox="0 0 100 133.33"
          preserveAspectRatio="none"
        >
          <rect x="2" y="2" width="96" height="129.33" rx="1" />

          <line x1="2" y1="66.66" x2="98" y2="66.66" />
          <circle cx="50" cy="66.66" r="12" />
          <circle cx="50" cy="66.66" r="0.8" fill="rgba(255,255,255,0.4)" />

          <rect x="22" y="2" width="56" height="20" />
          <rect x="36" y="2" width="28" height="7" />
          <circle cx="50" cy="15" r="0.8" fill="rgba(255,255,255,0.4)" />
          <path d="M 38 22 A 12 12 0 0 0 62 22" />

          <rect x="22" y="111.33" width="56" height="20" />
          <rect x="36" y="124.33" width="28" height="7" />
          <circle cx="50" cy="118.33" r="0.8" fill="rgba(255,255,255,0.4)" />
          <path d="M 38 111.33 A 12 12 0 0 1 62 111.33" />

          <path d="M 2 6 A 4 4 0 0 0 6 2" />
          <path d="M 94 2 A 4 4 0 0 0 98 6" />
          <path d="M 2 125.33 A 4 4 0 0 0 6 129.33" />
          <path d="M 98 125.33 A 4 4 0 0 1 94 129.33" />
        </svg>

        <div className="relative h-full w-full">
          {mainPlayers.map((player) => {
            const config =
              POSITION_GRID_MAP[player.spPosition] ?? DEFAULT_POSITION_CONFIG;
            const positionLabel =
              sppositionMap?.[player.spPosition] ?? config.label;

            const targetY = isOpponent ? 100 - config.y : config.y;

            const badgeColorClass = getPositionColorClass(player.spPosition);

            const currentRating = Number(player.status?.spRating ?? 0);
            const isMax = hasRatingDiff && currentRating === maxRating;
            const isMin = hasRatingDiff && currentRating === minRating;

            const playerName = spidNameMap[player?.spId] ?? "정보없음";

            let ratingColorClass = "text-white/90";
            if (isMax) {
              ratingColorClass =
                "text-amber-300 font-extrabold drop-shadow-[0_0_2px_rgba(251,191,36,0.8)]";
            } else if (isMin) {
              ratingColorClass = "text-rose-400 font-extrabold";
            }

            return (
              <div
                key={player.spId}
                style={{
                  left: `${config.x}%`,
                  top: `${targetY}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute flex w-16 flex-col items-center rounded-md border border-white/20 bg-black/60 p-1 text-center shadow-md backdrop-blur-md transition-all hover:z-20 hover:scale-105"
              >
                <div className="flex w-full items-center justify-between gap-1 border-b border-white/10 pb-0.5">
                  <span
                    className={`rounded px-1 text-[8px] leading-none font-extrabold ${badgeColorClass}`}
                  >
                    {positionLabel}
                  </span>
                  <span className="text-[8px] font-bold text-amber-300">
                    +{player.spGrade || 1}
                  </span>
                </div>

                <div className="my-0.5 h-8 w-8">
                  <PlayerImage spid={player.spId} />
                </div>

                <div
                  className={`w-full truncate text-[9px] leading-tight font-medium text-white/90`}
                >
                  {playerName}
                </div>

                <div
                  className={`w-full truncate text-[9px] leading-tight font-medium ${ratingColorClass}`}
                >
                  ★ {player.status?.spRating ?? "0.0"}
                </div>

                <div className="w-full truncate text-[9px] leading-tight font-medium text-white/90">
                  {player.status?.goal ?? 0}골 {player.status?.assist ?? 0}어시
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
