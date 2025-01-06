import { motion } from "framer-motion";
import { InsightPage } from "@/types";

interface Props {
  currentPage: number;
  insights: InsightPage[];
}

export const ProgressBar = ({ insights, currentPage }: Props) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2 flex gap-2">
      {insights.map((_, index) => (
        <div
          key={index}
          className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-white"
            initial={{ width: index < currentPage ? "100%" : "0%" }}
            animate={index === currentPage ? { width: "100%" } : ""}
            transition={
              index === currentPage ? { duration: 5, ease: "linear" } : {}
            }
          />
        </div>
      ))}
    </div>
  );
};
