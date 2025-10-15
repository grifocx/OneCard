import { useQuery } from "@tanstack/react-query";
import HistoryCard from "@/components/HistoryCard";
import type { Card, Task } from "@shared/schema";

type CardWithTasks = Card & { tasks: Task[] };

export default function HistoryPage() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const { data: historyCards, isLoading } = useQuery<CardWithTasks[]>({
    queryKey: ["/api/cards/history", { startDate: thirtyDaysAgo.toISOString(), endDate: today.toISOString() }],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 pt-8 px-4 flex items-center justify-center">
        <div className="text-muted-foreground">Loading history...</div>
      </div>
    );
  }

  const groupByWeek = (cards: CardWithTasks[]) => {
    const thisWeek: CardWithTasks[] = [];
    const lastWeek: CardWithTasks[] = [];
    const older: CardWithTasks[] = [];
    
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);
    
    cards.forEach(card => {
      const cardDate = new Date(card.date);
      if (cardDate >= weekAgo) {
        thisWeek.push(card);
      } else if (cardDate >= twoWeeksAgo) {
        lastWeek.push(card);
      } else {
        older.push(card);
      }
    });
    
    return { thisWeek, lastWeek, older };
  };

  const { thisWeek, lastWeek, older } = groupByWeek(historyCards || []);

  if (!historyCards || historyCards.length === 0) {
    return (
      <div className="min-h-screen pb-24 pt-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">History</h1>
            <p className="text-muted-foreground">Your past accomplishments</p>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            No history yet. Start completing tasks to build your track record!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">History</h1>
          <p className="text-muted-foreground">Your past accomplishments</p>
        </div>

        {thisWeek.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">This Week</h2>
            <div className="space-y-3">
              {thisWeek.map((card) => (
                <HistoryCard 
                  key={card.id} 
                  date={new Date(card.date)} 
                  tasks={card.tasks.map(t => ({
                    text: t.text,
                    completed: t.completed,
                    isBigTask: t.isBigTask
                  }))} 
                />
              ))}
            </div>
          </div>
        )}

        {lastWeek.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Last Week</h2>
            <div className="space-y-3">
              {lastWeek.map((card) => (
                <HistoryCard 
                  key={card.id} 
                  date={new Date(card.date)} 
                  tasks={card.tasks.map(t => ({
                    text: t.text,
                    completed: t.completed,
                    isBigTask: t.isBigTask
                  }))} 
                />
              ))}
            </div>
          </div>
        )}

        {older.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Older</h2>
            <div className="space-y-3">
              {older.map((card) => (
                <HistoryCard 
                  key={card.id} 
                  date={new Date(card.date)} 
                  tasks={card.tasks.map(t => ({
                    text: t.text,
                    completed: t.completed,
                    isBigTask: t.isBigTask
                  }))} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
