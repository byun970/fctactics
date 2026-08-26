import { useSearchStore } from "@/stores/useSearchStore";
import { MatchList } from "./MatchList";
import { Dialog, DialogContent } from "./ui/dialog";

export function MatchModal() {
  const isModalOpen = useSearchStore((state) => state.isModalOpen);
  const setIsModalOpen = useSearchStore((state) => state.setIsModalOpen);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
        <div className="mt-4">
          <MatchList />
        </div>
      </DialogContent>
    </Dialog>
  );
}
