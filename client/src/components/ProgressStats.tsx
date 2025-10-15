import { Card } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Award } from "lucide-react";

interface ProgressStatsProps {
  tasksThisWeek: number;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
}

export default function ProgressStats({ 
  tasksThisWeek, 
  currentStreak, 
  bestStreak,
  completionRate 
}: ProgressStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 hover-elevate">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Tasks This Week</p>
            <p 
              className="text-3xl font-bold font-mono text-foreground mt-1"
              data-testid="text-tasks-week"
            >
              {tasksThisWeek}
            </p>
          </div>
          <div className="p-2 bg-primary/10 rounded-md">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover-elevate">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p 
              className="text-3xl font-bold font-mono text-foreground mt-1"
              data-testid="text-completion-rate"
            >
              {completionRate}%
            </p>
          </div>
          <div className="p-2 bg-accent/10 rounded-md">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover-elevate">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p 
              className="text-3xl font-bold font-mono text-foreground mt-1"
              data-testid="text-current-streak-stat"
            >
              {currentStreak}
            </p>
          </div>
          <div className="p-2 bg-primary/10 rounded-md">
            <Award className="w-5 h-5 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover-elevate">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Best Streak</p>
            <p 
              className="text-3xl font-bold font-mono text-foreground mt-1"
              data-testid="text-best-streak"
            >
              {bestStreak}
            </p>
          </div>
          <div className="p-2 bg-accent/10 rounded-md">
            <Award className="w-5 h-5 text-accent" />
          </div>
        </div>
      </Card>
    </div>
  );
}
