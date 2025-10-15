import { useState } from "react";
import DailyCard from "@/components/DailyCard";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function TodayPage() {
  const [cardDestroyed, setCardDestroyed] = useState(false);

  const handleDestroy = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      setCardDestroyed(true);
      setTimeout(() => setCardDestroyed(false), 1000);
    }, 500);
  };

  return (
    <div className="min-h-screen pb-24 pt-8 px-4">
      <AnimatePresence mode="wait">
        {cardDestroyed ? (
          <motion.div
            key="destroyed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
          >
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-foreground">Card Cleared!</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Tomorrow is a new day with a new card. No guilt, just fresh starts.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DailyCard date={new Date()} onDestroy={handleDestroy} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
