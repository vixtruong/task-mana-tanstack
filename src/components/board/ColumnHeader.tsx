import type { Column } from '../../types/task';

interface ColumnHeaderProps {
  column: Column;
  count: number;
}

const COLORS: Record<string, string> = {
  'todo': 'bg-gray-400',
  'in-progress': 'bg-blue-500',
  'done': 'bg-green-500',
};

export function ColumnHeader({ column, count }: ColumnHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className={`w-3 h-3 rounded-full ${COLORS[column.status] || 'bg-gray-400'}`} />
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
        {column.title}
      </h3>
      <span className="ml-auto text-xs font-medium text-gray-400 bg-white rounded-full px-2 py-0.5">
        {count}
      </span>
    </div>
  );
}
