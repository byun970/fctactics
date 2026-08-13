import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form className="flex gap-2">
        <Input placeholder="구단주명 입력" />
        <Button>검색</Button>
      </form>
    </div>
  );
}
