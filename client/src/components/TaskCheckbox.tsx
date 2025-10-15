import { Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface TaskCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  isBigTask?: boolean;
  testId?: string;
}

export default function TaskCheckbox({ 
  checked, 
  onCheckedChange, 
  label, 
  isBigTask = false,
  testId 
}: TaskCheckboxProps) {
  const [localChecked, setLocalChecked] = useState(checked);

  const handleToggle = () => {
    const newChecked = !localChecked;
    setLocalChecked(newChecked);
    onCheckedChange(newChecked);
  };

  return (
    <div className="flex items-start gap-3 group">
      <button
        data-testid={testId}
        onClick={handleToggle}
        className={`
          flex-shrink-0 rounded-md border-2 transition-all duration-200
          ${localChecked 
            ? 'bg-primary border-primary' 
            : 'border-input hover-elevate active-elevate-2'
          }
          ${isBigTask ? 'w-7 h-7 mt-1' : 'w-6 h-6 mt-0.5'}
        `}
      >
        {localChecked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className={`${isBigTask ? 'w-6 h-6' : 'w-5 h-5'} text-primary-foreground`} strokeWidth={3} />
          </motion.div>
        )}
      </button>
      
      <span 
        className={`
          flex-1 transition-all duration-200
          ${localChecked ? 'line-through text-muted-foreground' : 'text-foreground'}
          ${isBigTask ? 'text-lg font-medium' : 'text-base'}
        `}
      >
        {label}
      </span>
    </div>
  );
}
