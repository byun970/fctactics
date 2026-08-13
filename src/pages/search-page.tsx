import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="from-background via-muted/50 to-background flex min-h-screen flex-col items-center justify-center bg-gradient-to-b p-4">
      <div className="w-full max-w-lg space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            전적 검색
          </h2>
          <p className="text-muted-foreground text-sm">
            구단주명을 입력하고 전적 및 매치 기록을 확인하세요.
          </p>
        </div>

        <div className="bg-card/80 rounded-2xl border p-3 shadow-lg backdrop-blur-sm sm:p-4">
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="구단주명 입력"
                className="border-muted focus-visible:ring-primary/50 h-12 text-base shadow-none focus-visible:ring-2"
              />
            </div>
            <Button
              size="lg"
              className="h-12 px-6 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="mr-1.5 h-4 w-4" />
              검색
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
