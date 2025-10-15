import DailyCard from '../DailyCard';

export default function DailyCardExample() {
  const mockTasks = [
    {
      id: '1',
      cardId: 'mock-card',
      text: 'Finish Chapter 7 reading',
      completed: false,
      isBigTask: true,
      order: 0,
      createdAt: new Date(),
    },
    {
      id: '2',
      cardId: 'mock-card',
      text: 'Do laundry',
      completed: false,
      isBigTask: false,
      order: 1,
      createdAt: new Date(),
    },
  ];

  return (
    <div className="p-6">
      <DailyCard 
        date={new Date()} 
        cardId="mock-card"
        existingTasks={mockTasks}
        onDestroy={() => console.log('Card destroyed')}
      />
    </div>
  );
}
