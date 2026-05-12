import { Draggable } from '@hello-pangea/dnd';
import { Calendar, User } from 'lucide-react';
import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  index: number;
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

export function TaskCard({ task, index }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg p-3 shadow-sm border transition-shadow ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</p>
            <span
              className={`shrink-0 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                PRIORITY_COLORS[task.priority] || ''
              }`}
            >
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {task.assignee && (
              <span className="flex items-center gap-1">
                <User size={12} />
                {task.assignee}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
