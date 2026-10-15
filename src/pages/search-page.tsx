import { SearchForm } from "@/components/SearchForm";

export default function SearchPage() {
  return (
    <div className="from-background via-muted/50 to-background flex min-h-screen flex-col items-center justify-center p-4">
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
      </div>
    </div>
  );
}
