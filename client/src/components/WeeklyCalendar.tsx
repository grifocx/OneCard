import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

interface DayStatus {
  date: Date;
  completed: boolean;
  tasksCompleted: number;
  totalTasks: number;
}

interface WeeklyCalendarProps {
  days: DayStatus[];
}

export default function WeeklyCalendar({ days }: WeeklyCalendarProps) {
  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Last 7 Days</h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div 
            key={index}
            className="flex flex-col items-center gap-2"
            data-testid={`day-${index}`}
          >
            <div className="text-xs text-muted-foreground font-medium">
              {formatDay(day.date)}
            </div>
            <div className="relative">
              {day.completed ? (
                <CheckCircle2 
                  className="w-8 h-8 text-primary" 
                  fill="currentColor"
                />
              ) : (
                <Circle className="w-8 h-8 text-border" strokeWidth={2} />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(day.date)}
            </div>
            {day.totalTasks > 0 && (
              <div className="text-xs text-muted-foreground">
                {day.tasksCompleted}/{day.totalTasks}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
