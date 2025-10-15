import StreakCounter from '../StreakCounter';

export default function StreakCounterExample() {
  return (
    <div className="p-6">
      <StreakCounter currentStreak={7} bestStreak={14} />
    </div>
  );
}
