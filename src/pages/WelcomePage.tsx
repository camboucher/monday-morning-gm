import { motion } from "framer-motion";
import { HelpCircle, Coffee, ArrowRight, Sun, Newspaper } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  leagueId: string;
  setLeagueId: (leagueId: string) => void;
  handleSubmit: () => void;
}

export const WelcomePage = ({ leagueId, setLeagueId, handleSubmit }: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 text-white">
      {/* Morning Sky Design Element */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-b from-yellow-200 to-transparent"
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-8 right-12"
        >
          <Sun className="w-16 h-16 text-yellow-200 opacity-50" />
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Coffee className="w-12 h-12 text-yellow-400" />
            <Newspaper className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Tuesday Morning GM</h1>
          <p className="text-xl text-gray-300 mb-8">
            Your fantasy season wrapped up with a fresh cup of insights
          </p>
        </motion.div>

        {/* Connect League Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter your Sleeper League ID"
                value={leagueId}
                onChange={(e) => setLeagueId(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-900 text-white border border-gray-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      How to Find Your League ID
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                      <p className="mb-4">
                        Your Sleeper League ID can be found in your league's
                        URL:
                      </p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Log in to Sleeper and go to your league</li>
                        <li>Look at the URL in your browser</li>
                        <li>The number after /league/ is your League ID</li>
                      </ol>
                      <p className="mt-4 text-sm">
                        Example: sleeper.app/leagues/
                        <span className="text-yellow-400">123456789</span>
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              disabled={!leagueId}
            >
              <span>Start Your Morning Review</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </motion.div>

        {/* Example League Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-black/20 rounded-xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            Preview a Sample League
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-2 mx-auto bg-gray-800">
                  <img
                    src={`/api/placeholder/64/64`}
                    alt={`Manager ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-400">Manager {i + 1}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Morning Paper Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "The Morning Recap",
              description:
                "Your season's biggest moments, served fresh with your coffee",
            },
            {
              title: "GM's Analysis",
              description:
                "Deep insights into your management style and decisions",
            },
            {
              title: "The Box Scores",
              description: "Your season by the numbers, no hot takes needed",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
