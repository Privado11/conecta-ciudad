import { useState } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type VotingButtonsProps = {
  projectId: number;
  onVote?: (projectId: number, vote: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
};

export function VotingButtons({
  projectId,
  onVote,
  disabled = false,
  loading = false,
}: VotingButtonsProps) {
  
  const [selectedVote, setSelectedVote] = useState<"up" | "down" | null>(null);

  const handleVote = (vote: boolean) => {
    setSelectedVote(vote ? "up" : "down");
    onVote?.(projectId, vote);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        
        <Button
          onClick={() => handleVote(true)}
          disabled={disabled || loading}
          variant="outline"
          className="gap-2 cursor-pointer transition-colors border-gray-300 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-400"
        >
          {loading && selectedVote === "up" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Votando…
            </>
          ) : (
            <>
              <ThumbsUp className="w-4 h-4" />
              A Favor
            </>
          )}
        </Button>

        <Button
          onClick={() => handleVote(false)}
          disabled={disabled || loading}
          variant="outline"
          className="gap-2 cursor-pointer transition-colors border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
        >
          {loading && selectedVote === "down" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Votando…
            </>
          ) : (
            <>
              <ThumbsDown className="w-4 h-4" />
              En Contra
            </>
          )}
        </Button>

      </div>

      <p className="text-xs text-center text-gray-500">
        Tu voto es importante para la decisión sobre este proyecto
      </p>
    </div>
  );
}
 