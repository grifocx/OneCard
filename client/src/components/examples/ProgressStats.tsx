import ProgressStats from '../ProgressStats';

export default function ProgressStatsExample() {
  return (
    <div className="p-6 max-w-3xl">
      <ProgressStats 
        tasksThisWeek={18}
        currentStreak={7}
        bestStreak={14}
        completionRate={85}
      />
    </div>
  );
}
