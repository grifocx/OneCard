import DailyCard from '../DailyCard';

export default function DailyCardExample() {
  return (
    <div className="p-6">
      <DailyCard 
        date={new Date()} 
        onDestroy={() => console.log('Card destroyed')}
      />
    </div>
  );
}
