import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HistoryTask {
  text: string;
  completed: boolean;
  isBigTask: boolean;
}

interface HistoryCardProps {
  date: Date;
  tasks: HistoryTask[];
}

export default function HistoryCard({ date, tasks }: HistoryCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <Card className="p-4 hover-elevate">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{formatDate(date)}</h3>
        </div>
        <Badge variant={completedCount === totalCount ? "default" : "secondary"}>
          {completedCount}/{totalCount}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div 
            key={index}
            className="flex items-start gap-2"
          >
            <div className={`
              flex-shrink-0 rounded-sm
              ${task.completed ? 'text-primary' : 'text-muted-foreground'}
              ${task.isBigTask ? 'mt-1' : 'mt-0.5'}
            `}>
              {task.completed ? (
                <Check className={task.isBigTask ? 'w-5 h-5' : 'w-4 h-4'} strokeWidth={2.5} />
              ) : (
                <div className={`border-2 border-current rounded-sm ${task.isBigTask ? 'w-5 h-5' : 'w-4 h-4'}`} />
              )}
            </div>
            <span className={`
              ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}
              ${task.isBigTask ? 'text-base font-medium' : 'text-sm'}
            `}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
