import { Loader2, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, type FormEvent } from "react";
import { useSearchStore } from "@/stores/useSearchStore";
import { useNavigate, useParams } from "react-router";

interface SearchFormProps {
  isLoading: boolean;
}

export function SearchForm({ isLoading }: SearchFormProps) {
  const { nickname } = useParams<{ nickname: string }>();
  const inputNickName = useSearchStore((state) => state.inputNickName);
  const naviagate = useNavigate();

  const setInputNickName = useSearchStore((state) => state.setInputNickName);
  const setSearchTarget = useSearchStore((state) => state.setSearchTarget);
  const setIsModalOpen = useSearchStore((state) => state.setIsModalOpen);

  useEffect(() => {
    if (nickname) {
      const decoded = decodeURIComponent(nickname);
      setInputNickName(decoded);
      setSearchTarget(decoded);
    }
  }, [nickname, setInputNickName, setSearchTarget]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputNickName.trim()) return;
    setSearchTarget(inputNickName.trim());
    naviagate(`/search/${encodeURIComponent(inputNickName.trim())}`);
  };

  return (
    <div className="bg-card/80 rounded-2xl border p-3 shadow-lg backdrop-blur-sm sm:p-4">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <div className="relative flex-1">
          <Input
            placeholder="구단주명 입력"
            value={inputNickName}
            className="border-muted focus-visible:ring-primary/50 h-12 text-base shadow-none focus-visible:ring-2"
            onChange={(e) => setInputNickName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button
          size="lg"
          disabled={isLoading}
          className="h-12 cursor-pointer px-6 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          type="submit"
        >
          {isLoading ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-1.5 h-4 w-4" />
          )}
          검색
        </Button>
      </form>
    </div>
  );
}
