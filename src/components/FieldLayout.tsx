import type { Player } from "@/types/nexon";
import { PlayerImage } from "./PlayerImage";
import {
  DEFAULT_POSITION_CONFIG,
  POSITION_GRID_MAP,
} from "@/constants/position";

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
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-muted-foreground text-center text-sm font-semibold">
        {title}
      </h4>
      <div className="relative w-full overflow-hidden rounded-xl border-2 border-emerald-600 bg-emerald-800 p-4 shadow-inner">
        <div className="pointer-events-none absolute inset-0 grid grid-cols-5 grid-rows-6 opacity-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="border border-white/40" />
          ))}
        </div>

        <div className={`relative z-10 grid h-full grid-cols-5 grid-rows-6`}>
          {players.map((player) => {
            const gridConfig =
              POSITION_GRID_MAP[player.spPosition] ?? DEFAULT_POSITION_CONFIG;
            const positionLabel =
              sppositionMap?.[player.spPosition] ?? gridConfig.label ?? "SUB";

            const targetRow = isOpponent ? 7 - gridConfig.row : gridConfig.row;

            return (
              <div
                key={player.spId}
                style={{
                  gridRow: targetRow,
                  gridColumn: gridConfig.col,
                }}
                className="flex flex-col items-center justify-center rounded-lg border border-white/20 bg-black/40 p-1 text-center text-white backdrop-blur-sm"
              >
                <span className="text-[10px] font-bold text-amber-300">
                  {positionLabel}
                </span>
                <div className="my-0.5 h-8 w-8">
                  <PlayerImage spid={player.spId} />
                </div>
                <div className="w-full truncate text-[10px] leading-tight font-medium">
                  {player.spGrade || 1}강 | {player.status?.goal ?? 0}골
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
