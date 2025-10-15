import HistoryCard from "@/components/HistoryCard";

export default function HistoryPage() {
  const today = new Date();
  
  const historyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (i + 1));
    
    const tasks = [
      { 
        text: i % 3 === 0 ? "Finish Chapter 7 reading" : i % 2 === 0 ? "Write essay outline" : "Study for quiz",
        completed: i < 5,
        isBigTask: true 
      },
      { text: "Do laundry", completed: i < 4, isBigTask: false },
      { text: "Email Professor Smith", completed: i < 3, isBigTask: false },
      { text: "Go to the gym", completed: i < 5, isBigTask: false },
    ];

    return { date, tasks };
  });

  const groupByWeek = (data: typeof historyData) => {
    const thisWeek: typeof historyData = [];
    const lastWeek: typeof historyData = [];
    
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    data.forEach(item => {
      if (item.date >= weekAgo) {
        thisWeek.push(item);
      } else {
        lastWeek.push(item);
      }
    });
    
    return { thisWeek, lastWeek };
  };

  const { thisWeek, lastWeek } = groupByWeek(historyData);

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
              {thisWeek.map((item, index) => (
                <HistoryCard key={index} date={item.date} tasks={item.tasks} />
              ))}
            </div>
          </div>
        )}

        {lastWeek.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Last Week</h2>
            <div className="space-y-3">
              {lastWeek.map((item, index) => (
                <HistoryCard key={index} date={item.date} tasks={item.tasks} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
