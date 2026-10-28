import { SearchForm } from "@/components/SearchForm";

const FEATURES = ["최근 경기", "스쿼드", "플레이 스타일"];

export default function SearchPage() {
  return (
    <div className="from-background via-muted/50 to-background flex min-h-[60vh] flex-col items-center justify-center bg-linear-to-b p-4">
      <div className="w-full max-w-lg space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            전적 검색
          </h2>
          <p className="text-muted-foreground text-sm">
            구단주명을 입력하고 전적 및 매치 기록을 확인하세요.
          </p>
        </div>

        <SearchForm isLoading={false} />

        <ul className="flex justify-center gap-2 sm:gap-3">
          {FEATURES.map((label) => (
            <li
              key={label}
              className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
