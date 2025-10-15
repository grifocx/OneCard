import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import TaskCheckbox from "./TaskCheckbox";
import { motion } from "framer-motion";
import type { Task as DBTask } from "@shared/schema";

interface DailyCardProps {
  date: Date;
  cardId: string;
  existingTasks: DBTask[];
  onDestroy?: () => void;
}

interface LocalTask {
  id: string;
  text: string;
  completed: boolean;
  isBigTask: boolean;
  order: number;
}

export default function DailyCard({ date, cardId, existingTasks, onDestroy }: DailyCardProps) {
  const [bigTask, setBigTask] = useState<LocalTask>({ 
    id: '', 
    text: '', 
    completed: false,
    isBigTask: true,
    order: 0
  });
  const [smallTasks, setSmallTasks] = useState<LocalTask[]>([
    { id: '', text: '', completed: false, isBigTask: false, order: 1 },
    { id: '', text: '', completed: false, isBigTask: false, order: 2 },
    { id: '', text: '', completed: false, isBigTask: false, order: 3 },
  ]);

  useEffect(() => {
    if (existingTasks && existingTasks.length > 0) {
      const big = existingTasks.find(t => t.isBigTask);
      if (big) {
        setBigTask({
          id: big.id,
          text: big.text,
          completed: big.completed,
          isBigTask: true,
          order: big.order
        });
      }

      const smalls = existingTasks.filter(t => !t.isBigTask).sort((a, b) => a.order - b.order);
      const updatedSmallTasks = [0, 1, 2].map(i => {
        const existing = smalls[i];
        return existing ? {
          id: existing.id,
          text: existing.text,
          completed: existing.completed,
          isBigTask: false,
          order: existing.order
        } : { id: '', text: '', completed: false, isBigTask: false, order: i + 1 };
      });
      setSmallTasks(updatedSmallTasks);
    }
  }, [existingTasks]);

  const createTaskMutation = useMutation({
    mutationFn: async (task: { text: string; isBigTask: boolean; order: number }) => {
      const res = await apiRequest("POST", "/api/tasks", {
        cardId,
        ...task,
        completed: false
      });
      return res.json();
    },
    onSuccess: (newTask: DBTask, variables) => {
      if (variables.isBigTask) {
        setBigTask(prev => ({ ...prev, id: newTask.id }));
      } else {
        setSmallTasks(prev => prev.map(t => 
          t.order === variables.order ? { ...t, id: newTask.id } : t
        ));
      }
      queryClient.invalidateQueries({ queryKey: ["/api/cards/today"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DBTask> }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards/today"] });
    },
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleBigTaskTextChange = (text: string) => {
    setBigTask(prev => ({ ...prev, text }));
  };

  const handleBigTaskBlur = () => {
    if (bigTask.text && !bigTask.id) {
      createTaskMutation.mutate({ text: bigTask.text, isBigTask: true, order: 0 });
    } else if (bigTask.id && bigTask.text) {
      updateTaskMutation.mutate({ id: bigTask.id, updates: { text: bigTask.text } });
    }
  };

  const handleBigTaskCheck = (checked: boolean) => {
    setBigTask(prev => ({ ...prev, completed: checked }));
    if (bigTask.id) {
      updateTaskMutation.mutate({ id: bigTask.id, updates: { completed: checked } });
    }
  };

  const handleSmallTaskTextChange = (index: number, text: string) => {
    setSmallTasks(prev => prev.map((t, i) => i === index ? { ...t, text } : t));
  };

  const handleSmallTaskBlur = (index: number) => {
    const task = smallTasks[index];
    if (task.text && !task.id) {
      createTaskMutation.mutate({ text: task.text, isBigTask: false, order: task.order });
    } else if (task.id && task.text) {
      updateTaskMutation.mutate({ id: task.id, updates: { text: task.text } });
    }
  };

  const handleSmallTaskCheck = (index: number, checked: boolean) => {
    const task = smallTasks[index];
    setSmallTasks(prev => prev.map((t, i) => i === index ? { ...t, completed: checked } : t));
    if (task.id) {
      updateTaskMutation.mutate({ id: task.id, updates: { completed: checked } });
    }
  };

  const canDestroy = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 18; // 6 PM
  };

  const allTasks = [bigTask, ...smallTasks];
  const completedCount = allTasks.filter(t => t.completed && t.text).length;
  const totalCount = allTasks.filter(t => t.text).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-foreground" data-testid="text-date">
            {formatDate(date)}
          </h2>
          <p className="text-sm text-muted-foreground">
            What's the one thing that will make today a success?
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              The Big One
            </label>
            <input
              data-testid="input-big-task"
              type="text"
              value={bigTask.text}
              onChange={(e) => handleBigTaskTextChange(e.target.value)}
              onBlur={handleBigTaskBlur}
              placeholder="e.g., Finish Chapter 7 reading"
              className="w-full px-4 py-3 text-lg bg-background border-2 border-primary/30 rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
            />
            {bigTask.text && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
              >
                <TaskCheckbox
                  checked={bigTask.completed}
                  onCheckedChange={handleBigTaskCheck}
                  label={bigTask.text}
                  isBigTask={true}
                  testId="checkbox-big-task"
                />
              </motion.div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              2-3 Smaller Things
            </label>
            <div className="space-y-3">
              {smallTasks.map((task, index) => (
                <div key={index}>
                  <input
                    data-testid={`input-small-task-${index + 1}`}
                    type="text"
                    value={task.text}
                    onChange={(e) => handleSmallTaskTextChange(index, e.target.value)}
                    onBlur={() => handleSmallTaskBlur(index)}
                    placeholder={`e.g., ${index === 0 ? 'Do laundry' : index === 1 ? 'Email Professor Smith' : 'Go to the gym'}`}
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground/50"
                  />
                  {task.text && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="mt-2"
                    >
                      <TaskCheckbox
                        checked={task.completed}
                        onCheckedChange={(checked) => handleSmallTaskCheck(index, checked)}
                        label={task.text}
                        testId={`checkbox-small-task-${index + 1}`}
                      />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {totalCount > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {completedCount} of {totalCount} completed
              </span>
              {canDestroy() && onDestroy && (
                <Button
                  data-testid="button-destroy-card"
                  variant="outline"
                  size="sm"
                  onClick={onDestroy}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Card
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
