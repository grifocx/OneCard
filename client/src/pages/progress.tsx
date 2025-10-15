import { useQuery } from "@tanstack/react-query";
import StreakCounter from "@/components/StreakCounter";
import ProgressStats from "@/components/ProgressStats";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import type { Card, Task } from "@shared/schema";

type CardWithTasks = Card & { tasks: Task[] };

export default function ProgressPage() {
  const { data: streakStats } = useQuery<{ currentStreak: number; bestStreak: number }>({
    queryKey: ["/api/stats/streak"],
  });

  const { data: weeklyStats } = useQuery<{ tasksCompleted: number; completionRate: number }>({
    queryKey: ["/api/stats/weekly"],
  });

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  
  const { data: weekCards } = useQuery<CardWithTasks[]>({
    queryKey: ["/api/cards/history", { startDate: sevenDaysAgo.toISOString(), endDate: today.toISOString() }],
  });

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    
    const card = weekCards?.find(c => {
      const cardDate = new Date(c.date);
      cardDate.setHours(0, 0, 0, 0);
      return cardDate.getTime() === date.getTime();
    });

    const tasksCompleted = card?.tasks.filter(t => t.completed).length || 0;
    const totalTasks = card?.tasks.length || 0;
    
    return {
      date,
      completed: card?.destroyed && tasksCompleted > 0 || false,
      tasksCompleted,
      totalTasks,
    };
  });

  if (!streakStats || !weeklyStats) {
    return (
      <div className="min-h-screen pb-24 pt-8 px-4 flex items-center justify-center">
        <div className="text-muted-foreground">Loading progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Progress</h1>
          <p className="text-muted-foreground">Building momentum, one day at a time</p>
        </div>

        <div className="flex justify-center py-4">
          <StreakCounter 
            currentStreak={streakStats.currentStreak} 
            bestStreak={streakStats.bestStreak} 
          />
        </div>

        <WeeklyCalendar days={days} />

        <ProgressStats 
          tasksThisWeek={weeklyStats.tasksCompleted}
          currentStreak={streakStats.currentStreak}
          bestStreak={streakStats.bestStreak}
          completionRate={weeklyStats.completionRate}
        />
      </div>
    </div>
  );
}
