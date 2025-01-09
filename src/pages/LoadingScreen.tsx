import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Check, Loader } from "lucide-react";
import { fetchLeague } from "../apiQueries";

interface LoadingStep {
  label: string;
  duration: number;
  apiCall: () => Promise<unknown>;
}

interface LoadingStepProps {
  step: LoadingStep;
  isActive: boolean;
  isComplete: boolean;
}

const LoadingStep = ({ step, isActive, isComplete }: LoadingStepProps) => {
  return (
    <motion.div
      className="flex items-center space-x-3 text-gray-400"
      animate={{
        color: isComplete ? "#4ade80" : isActive ? "#fbbf24" : "#9ca3af",
      }}
    >
      <div className="relative">
        {isComplete ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        ) : isActive ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6"
          >
            <Loader className="w-6 h-6 text-yellow-400" />
          </motion.div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
        )}
      </div>
      <span
        className={`${
          isComplete
            ? "text-green-500"
            : isActive
            ? "text-yellow-400"
            : "text-gray-400"
        }`}
      >
        {step.label}
      </span>
    </motion.div>
  );
};

interface LoadingScreenProps {
  onLoadingComplete?: (isLoaded: boolean) => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const loadingSteps = [
    {
      label: "Connecting to league",
      duration: 2000,
      apiCall: () => fetchLeague("1124842192234356736"),
    },
    {
      label: "Fetching roster data",
      duration: 3000,
      apiCall: () => new Promise((resolve) => setTimeout(resolve, 3000)),
    },
    {
      label: "Analyzing draft picks",
      duration: 2500,
      apiCall: () => new Promise((resolve) => setTimeout(resolve, 2500)),
    },
    {
      label: "Processing transactions",
      duration: 2000,
      apiCall: () => new Promise((resolve) => setTimeout(resolve, 2000)),
    },
    {
      label: "Calculating insights",
      duration: 2500,
      apiCall: () => new Promise((resolve) => setTimeout(resolve, 2500)),
    },
  ];

  useEffect(() => {
    const processStep = async (stepIndex: number) => {
      if (stepIndex >= loadingSteps.length) {
        setTimeout(() => {
          onLoadingComplete?.(false);
        }, 1000);
        return;
      }

      setActiveStep(stepIndex);
      try {
        await loadingSteps[stepIndex].apiCall();
        setCompletedSteps((prev) => new Set([...prev, stepIndex]));
        processStep(stepIndex + 1);
      } catch (error) {
        console.error("Error processing step:", error);
      }
    };

    processStep(0);
  }, []);

  const progress = (completedSteps.size / loadingSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 text-white flex flex-col items-center justify-center p-8">
      {/* Coffee Icon with Steam */}
      <div className="relative mb-8">
        <Coffee className="w-16 h-16 text-yellow-400" />
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-full left-1/2 w-2 h-2 bg-yellow-200/20 rounded-full"
            animate={{
              y: [-20, -40],
              x: [0, i === 0 ? -10 : i === 2 ? 10 : 0],
              opacity: [0.8, 0],
              scale: [1, 2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Progress Steps */}
      <div className="max-w-md w-full mb-8">
        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <LoadingStep
              key={index}
              step={step}
              isActive={activeStep === index}
              isComplete={completedSteps.has(index)}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-yellow-400"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Progress Percentage */}
      <motion.p
        className="mt-4 text-yellow-400 font-semibold"
        animate={{ opacity: [0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {Math.round(progress)}% Complete
      </motion.p>

      {/* Completion Animation */}
      <AnimatePresence>
        {completedSteps.size === loadingSteps.length && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="text-green-400 text-2xl font-bold"
            >
              Ready for your morning review!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
