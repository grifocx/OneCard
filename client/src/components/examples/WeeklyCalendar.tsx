import WeeklyCalendar from '../WeeklyCalendar';

export default function WeeklyCalendarExample() {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return {
      date,
      completed: i < 5,
      tasksCompleted: i < 5 ? 3 + (i % 2) : 0,
      totalTasks: i < 5 ? 4 : 0,
    };
  });

  return (
    <div className="p-6 max-w-3xl">
      <WeeklyCalendar days={days} />
    </div>
  );
}
