import TaskCheckbox from '../TaskCheckbox';

export default function TaskCheckboxExample() {
  return (
    <div className="space-y-4 p-6 max-w-md">
      <TaskCheckbox 
        checked={false}
        onCheckedChange={(checked) => console.log('Big task checked:', checked)}
        label="Finish Chapter 7 reading"
        isBigTask={true}
        testId="checkbox-big-task"
      />
      <TaskCheckbox 
        checked={false}
        onCheckedChange={(checked) => console.log('Small task checked:', checked)}
        label="Email Professor Smith"
        testId="checkbox-small-task-1"
      />
      <TaskCheckbox 
        checked={true}
        onCheckedChange={(checked) => console.log('Completed task checked:', checked)}
        label="Go to the gym"
        testId="checkbox-small-task-2"
      />
    </div>
  );
}
