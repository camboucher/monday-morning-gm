import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  direction: "left" | "right";
  navigateStory: (newDirection: 1 | -1) => void;
  className?: string;
}

export const NavButton = ({ direction, navigateStory, className }: Props) => {
    
  return (
    <button
      onClick={() => {
        navigateStory(direction === "left" ? -1 : 1);
      }}
      className={className}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-8 h-8" />
      ) : (
        <ChevronRight className="w-8 h-8" />
      )}
    </button>
  );
};
