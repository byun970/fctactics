import { useSearchStore } from "@/stores/useSearchStore";
import { Button } from "./ui/button";
import { type MatchTypeMeta } from "@/types/nexon";

interface MatchTypeFilterProps {
  matchTypes: MatchTypeMeta[];
}

export function MatchTypeFilter({ matchTypes }: MatchTypeFilterProps) {
  const selectedMatchType = useSearchStore((state) => state.selectedMatchType);
  const setSelectedMatchType = useSearchStore(
    (state) => state.setSelectedMatchType,
  );

  if (!Array.isArray(matchTypes) || matchTypes.length === 0) {
    return null;
  }
  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex flex-wrap justify-center gap-1.5">
        {matchTypes.map((type) => (
          <Button
            key={type.matchtype}
            variant={
              selectedMatchType === type.matchtype ? "default" : "outline"
            }
            size="sm"
            className="cursor-pointer text-xs"
            onClick={() => setSelectedMatchType(type.matchtype)}
          >
            {type.desc}
          </Button>
        ))}
      </div>
    </div>
  );
}
