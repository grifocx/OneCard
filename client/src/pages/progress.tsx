import StreakCounter from "@/components/StreakCounter";
import ProgressStats from "@/components/ProgressStats";
import WeeklyCalendar from "@/components/WeeklyCalendar";

export default function ProgressPage() {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return {
      date,
      completed: i < 5,
      tasksCompleted: i < 5 ? 3 + (i % 2) : 0,
      totalTasks: i < 5 ? 4 : 0,
    };
  });

  return (
    <div className="min-h-screen pb-24 pt-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Progress</h1>
          <p className="text-muted-foreground">Building momentum, one day at a time</p>
        </div>

        <div className="flex justify-center py-4">
          <StreakCounter currentStreak={7} bestStreak={14} />
        </div>

        <WeeklyCalendar days={days} />

        <ProgressStats 
          tasksThisWeek={18}
          currentStreak={7}
          bestStreak={14}
          completionRate={85}
        />
      </div>
    </div>
  );
}
