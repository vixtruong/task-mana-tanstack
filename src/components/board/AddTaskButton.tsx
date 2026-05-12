import { Plus } from 'lucide-react';

interface AddTaskButtonProps {
  onClick: () => void;
}

export function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
    >
      <Plus size={16} />
      Add Task
    </button>
  );
}
