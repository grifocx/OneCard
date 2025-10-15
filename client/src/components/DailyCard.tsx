import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import TaskCheckbox from "./TaskCheckbox";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface DailyCardProps {
  date: Date;
  onDestroy?: () => void;
}

export default function DailyCard({ date, onDestroy }: DailyCardProps) {
  const [bigTask, setBigTask] = useState<Task>({ 
    id: '1', 
    text: '', 
    completed: false 
  });
  const [smallTasks, setSmallTasks] = useState<Task[]>([
    { id: '2', text: '', completed: false },
    { id: '3', text: '', completed: false },
    { id: '4', text: '', completed: false },
  ]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleBigTaskChange = (checked: boolean) => {
    setBigTask({ ...bigTask, completed: checked });
  };

  const handleSmallTaskChange = (id: string, checked: boolean) => {
    setSmallTasks(smallTasks.map(task => 
      task.id === id ? { ...task, completed: checked } : task
    ));
  };

  const canDestroy = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 18; // 6 PM
  };

  const completedCount = [bigTask, ...smallTasks].filter(t => t.completed && t.text).length;
  const totalCount = [bigTask, ...smallTasks].filter(t => t.text).length;

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
              onChange={(e) => setBigTask({ ...bigTask, text: e.target.value })}
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
                  onCheckedChange={handleBigTaskChange}
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
                <div key={task.id}>
                  <input
                    data-testid={`input-small-task-${index + 1}`}
                    type="text"
                    value={task.text}
                    onChange={(e) => setSmallTasks(smallTasks.map(t => 
                      t.id === task.id ? { ...t, text: e.target.value } : t
                    ))}
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
                        onCheckedChange={(checked) => handleSmallTaskChange(task.id, checked)}
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
