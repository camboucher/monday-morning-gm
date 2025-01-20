import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Brain,
  ArrowUpDown,
  UserPlus,
  Heart,
  Shuffle,
} from "lucide-react";
import { InsightPage } from "@/types";
import { ProgressBar } from "@/components/ui/progressBar";
import { NavButton } from "@/components/ui/navButtons";

export const FantasyWrappedStory = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const insights: InsightPage[] = [
    {
      title: "Best Drafter",
      icon: <Trophy className="w-16 h-16 text-yellow-500" />,
      description:
        "Sarah dominated the draft with 1,865 points from drafted players",
      detail: "78% of her total points came from her draft picks",
      bg_color: "from-yellow-900 to-yellow-800",
    },
    {
      title: "Best Decision Maker",
      icon: <Brain className="w-16 h-16 text-blue-500" />,
      description: "Mike left only 156 potential points on the bench",
      detail: "96% optimal lineup decisions",
      bg_color: "from-blue-900 to-blue-800",
    },
    {
      title: "Best Trader",
      icon: <ArrowUpDown className="w-16 h-16 text-green-500" />,
      description: "Alex gained 245 points through trades",
      detail: "Made 8 trades, 6 were wins",
      bg_color: "from-green-900 to-green-800",
    },
    {
      title: "Best In-Season Manager",
      icon: <UserPlus className="w-16 h-16 text-purple-500" />,
      description: "Chris found 468 points from free agents",
      detail: "Including breakout star Puka Nacua",
      bg_color: "from-purple-900 to-purple-800",
    },
    {
      title: "Worst Injury Luck",
      icon: <Heart className="w-16 h-16 text-red-500" />,
      description: "Pat lost 386 expected points to injuries",
      detail: "Lost both Mark Andrews and Kenneth Walker",
      bg_color: "from-red-900 to-red-800",
    },
    {
      title: "Worst Matchup Luck",
      icon: <Shuffle className="w-16 h-16 text-indigo-500" />,
      description: "Jordan would have made playoffs with average luck",
      detail: "Lost 5 games despite outscoring opponents' average",
      bg_color: "from-indigo-900 to-indigo-800",
    },
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setTimeout(() => {
        if (currentPage < insights.length - 1) {
          setDirection(1);
          setCurrentPage(currentPage + 1);
        } else {
          setIsAutoPlaying(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, isAutoPlaying]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const navigateStory = (newDirection: 1 | -1) => {
    setIsAutoPlaying(false);
    const newPage = currentPage + newDirection;
    if (newPage >= 0 && newPage < insights.length) {
      setDirection(newDirection);
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900">
      <ProgressBar insights={insights} currentPage={currentPage} />
      {currentPage > 0 && (
        <NavButton
          direction="left"
          navigateStory={navigateStory}
          className="fixed left-4 top-1/2 z-50 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
        />
      )}
      {currentPage < insights.length - 1 && <NavButton
        direction="right"
        navigateStory={navigateStory}
        className="fixed right-4 top-1/2 z-50 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
      />}
        <motion.div
          key={currentPage}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${insights[currentPage].bg_color}`}
        >
          <div className="max-w-2xl w-full mx-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="mb-8">{insights[currentPage].icon}</div>
              <h2 className="text-4xl font-bold text-white mb-6">
                {insights[currentPage].title}
              </h2>
              <p className="text-2xl text-white mb-4">
                {insights[currentPage].description}
              </p>
              <p className="text-xl text-white/80">
                {insights[currentPage].detail}
              </p>
            </motion.div>
          </div>
        </motion.div>
    </div>
  );
};