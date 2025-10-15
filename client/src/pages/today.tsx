import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import DailyCard from "@/components/DailyCard";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { Card, Task } from "@shared/schema";

type CardWithTasks = Card & { tasks: Task[] };

export default function TodayPage() {
  const [cardDestroyed, setCardDestroyed] = useState(false);

  const { data: todayCard, isLoading } = useQuery<CardWithTasks | null>({
    queryKey: ["/api/cards/today"],
  });

  const createCardMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/cards", { date: new Date() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards/today"] });
    },
  });

  const destroyCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      return apiRequest("POST", `/api/cards/${cardId}/destroy`);
    },
    onSuccess: () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        setCardDestroyed(true);
        queryClient.invalidateQueries({ queryKey: ["/api/cards/today"] });
        setTimeout(() => setCardDestroyed(false), 2000);
      }, 500);
    },
  });

  useEffect(() => {
    if (!isLoading && !todayCard) {
      createCardMutation.mutate();
    }
  }, [isLoading, todayCard]);

  const handleDestroy = () => {
    if (todayCard) {
      destroyCardMutation.mutate(todayCard.id);
    }
  };

  if (isLoading || !todayCard) {
    return (
      <div className="min-h-screen pb-24 pt-8 px-4 flex items-center justify-center">
        <div className="text-muted-foreground">Loading your card...</div>
      </div>
    );
  }

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
            <DailyCard 
              date={new Date(todayCard.date)} 
              cardId={todayCard.id}
              existingTasks={todayCard.tasks}
              onDestroy={handleDestroy} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
