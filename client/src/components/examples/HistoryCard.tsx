import HistoryCard from '../HistoryCard';

export default function HistoryCardExample() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const tasks = [
    { text: "Finish Chapter 7 reading", completed: true, isBigTask: true },
    { text: "Do laundry", completed: true, isBigTask: false },
    { text: "Email Professor Smith", completed: false, isBigTask: false },
    { text: "Go to the gym", completed: true, isBigTask: false },
  ];

  return (
    <div className="p-6 max-w-md">
      <HistoryCard date={yesterday} tasks={tasks} />
    </div>
  );
}
