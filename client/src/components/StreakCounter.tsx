import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
}

export default function StreakCounter({ currentStreak, bestStreak }: StreakCounterProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative"
      >
        <Flame 
          className="w-16 h-16 text-accent" 
          fill="currentColor"
          strokeWidth={1.5}
        />
        {currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span 
              className="text-2xl font-bold font-mono text-accent-foreground"
              data-testid="text-current-streak"
            >
              {currentStreak}
            </span>
          </motion.div>
        )}
      </motion.div>
      
      <div className="text-left">
        <div className="text-4xl font-bold font-mono text-foreground">
          {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
        </div>
        <div className="text-sm text-muted-foreground">
          Best: {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
        </div>
      </div>
    </div>
  );
}
