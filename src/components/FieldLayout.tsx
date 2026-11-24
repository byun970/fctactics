import type { CSSProperties } from "react";
import type { Player } from "@/types/nexon";
import { PlayerImage } from "./PlayerImage";
import {
  DEFAULT_POSITION_CONFIG,
  POSITION_GRID_MAP,
  getPositionColorClass,
} from "@/constants/position";
import { useSpidNameMap } from "@/hooks/useUserMatches";

interface FieldLayoutProps {
  myTitle: string;
  myPlayers: Player[];
  opponentTitle: string;
  opponentPlayers: Player[];
  sppositionMap?: Record<number, string>;
}

const DOT = "rgba(255,255,255,0.4)";

// 모바일: 세로 보드 (상대 위 / 나 아래)
function VerticalPitch() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full stroke-white/30 lg:hidden"
      strokeWidth="1.5"
      fill="none"
      viewBox="0 0 100 333"
    >
      <rect x="2" y="2" width="96" height="329" rx="1" />
      <line x1="2" y1="166.5" x2="98" y2="166.5" />
      <circle cx="50" cy="166.5" r="14" />
      <circle cx="50" cy="166.5" r="0.8" fill={DOT} />

      <rect x="24" y="2" width="52" height="40" />
      <rect x="38" y="2" width="24" height="14" />
      <circle cx="50" cy="30" r="0.8" fill={DOT} />
      <path d="M 40 42 A 11 11 0 0 0 60 42" />

      <rect x="24" y="291" width="52" height="40" />
      <rect x="38" y="317" width="24" height="14" />
      <circle cx="50" cy="303" r="0.8" fill={DOT} />
      <path d="M 40 291 A 11 11 0 0 1 60 291" />
    </svg>
  );
}

// 데스크톱: 가로 보드 (나 왼쪽 / 상대 오른쪽)
function HorizontalPitch() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full stroke-white/30 lg:block"
      strokeWidth="1.5"
      fill="none"
      viewBox="0 0 150 100"
    >
      <rect x="2" y="2" width="146" height="96" rx="1" />
      <line x1="75" y1="2" x2="75" y2="98" />
      <circle cx="75" cy="50" r="12" />
      <circle cx="75" cy="50" r="0.8" fill={DOT} />

      <rect x="2" y="24" width="30" height="52" />
      <rect x="2" y="38" width="11" height="24" />
      <circle cx="22" cy="50" r="0.8" fill={DOT} />
      <path d="M 32 40 A 11 11 0 0 1 32 60" />

      <rect x="118" y="24" width="30" height="52" />
      <rect x="137" y="38" width="11" height="24" />
      <circle cx="128" cy="50" r="0.8" fill={DOT} />
      <path d="M 118 40 A 11 11 0 0 0 118 60" />
    </svg>
  );
}

interface TeamPlayersProps {
  players: Player[];
  sppositionMap?: Record<number, string>;
  isOpponent: boolean;
}

function TeamPlayers({ players, sppositionMap, isOpponent }: TeamPlayersProps) {
  const spidNameMap = useSpidNameMap();
  const mainPlayers = players.filter((p) => p.spPosition !== 28);

  const ratings = mainPlayers
    .map((p) => Number(p.status?.spRating ?? 0))
    .filter((r) => !isNaN(r));
  const maxRating = ratings.length > 0 ? Math.max(...ratings) : 1;
  const minRating = ratings.length > 0 ? Math.min(...ratings) : 1;
  const hasRatingDiff = maxRating !== minRating;

  return (
    <>
      {mainPlayers.map((player) => {
        const config =
          POSITION_GRID_MAP[player.spPosition] ?? DEFAULT_POSITION_CONFIG;
        const positionLabel = sppositionMap?.[player.spPosition] ?? config.label;
        const { x, y } = config;

        // 세로(모바일): 내 팀은 아래 절반, 상대는 위 절반(좌우 반전)
        const mobileTop = isOpponent ? 50 - y / 2 : 50 + y / 2;
        const mobileLeft = isOpponent ? 100 - x : x;
        // 가로(데스크톱): 내 팀은 왼쪽 절반, 상대는 오른쪽 절반(상하 반전)
        const desktopLeft = isOpponent ? 50 + y / 2 : 50 - y / 2;
        const desktopTop = isOpponent ? 100 - x : x;

        const currentRating = Number(player.status?.spRating ?? 0);
        const isMax = hasRatingDiff && currentRating === maxRating;
        const isMin = hasRatingDiff && currentRating === minRating;

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
            style={
              {
                "--m-left": `${mobileLeft}%`,
                "--m-top": `${mobileTop}%`,
                "--d-left": `${desktopLeft}%`,
                "--d-top": `${desktopTop}%`,
              } as CSSProperties
            }
            className="absolute top-[var(--m-top)] left-[var(--m-left)] flex w-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-md border border-white/20 bg-black/60 p-0.5 text-center shadow-md backdrop-blur-md transition-transform hover:z-20 hover:scale-105 sm:w-16 sm:p-1 lg:top-[var(--d-top)] lg:left-[var(--d-left)] lg:w-14"
          >
            <div className="flex w-full items-center justify-between gap-1 border-b border-white/10 pb-0.5">
              <span
                className={`rounded px-1 text-[8px] leading-none font-extrabold ${getPositionColorClass(player.spPosition)}`}
              >
                {positionLabel}
              </span>
              <span className="text-[8px] font-bold text-amber-300">
                +{player.spGrade || 1}
              </span>
            </div>

            <div className="my-0.5 flex h-6 w-6 justify-center sm:h-8 sm:w-8">
              <PlayerImage spid={player.spId} className="h-full" />
            </div>

            <div className="w-full truncate text-[9px] leading-tight font-medium text-white/90">
              {spidNameMap[player?.spId] ?? "정보없음"}
            </div>

            <div
              className={`w-full truncate text-[9px] leading-tight font-medium ${ratingColorClass}`}
            >
              ★ {player.status?.spRating ?? "0.0"}
            </div>

            <div className="hidden w-full truncate text-[9px] leading-tight font-medium text-white/90 sm:block">
              {player.status?.goal ?? 0}골 {player.status?.assist ?? 0}어시
            </div>
          </div>
        );
      })}
    </>
  );
}

const titleClass = "text-muted-foreground truncate text-sm font-semibold";

export function FieldLayout({
  myTitle,
  myPlayers,
  opponentTitle,
  opponentPlayers,
  sppositionMap,
}: FieldLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-2 lg:max-w-none">
      {/* 모바일: 상대 이름은 보드 위, 내 이름은 보드 아래 / 데스크톱: 좌(나) 우(상대) */}
      <div className="flex justify-center lg:justify-between">
        <h4 className={`${titleClass} hidden lg:block`}>{myTitle}</h4>
        <h4 className={titleClass}>{opponentTitle}</h4>
      </div>

      <div className="relative aspect-[3/10] w-full overflow-hidden rounded-xl border-2 border-emerald-600/60 bg-emerald-800 shadow-inner lg:aspect-[3/2]">
        <VerticalPitch />
        <HorizontalPitch />
        <TeamPlayers
          players={myPlayers}
          sppositionMap={sppositionMap}
          isOpponent={false}
        />
        <TeamPlayers
          players={opponentPlayers}
          sppositionMap={sppositionMap}
          isOpponent
        />
      </div>

      <h4 className={`${titleClass} text-center lg:hidden`}>{myTitle}</h4>
    </div>
  );
}
