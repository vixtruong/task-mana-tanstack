import { Droppable } from '@hello-pangea/dnd';
import { ColumnHeader } from './ColumnHeader';
import { TaskCard } from './TaskCard';
import { AddTaskButton } from './AddTaskButton';
import { useUIStore } from '../../store/uiStore';
import type { Task, Column as ColumnType } from '../../types/task';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export function Column({ column, tasks }: ColumnProps) {
  const openTaskModal = useUIStore((s) => s.openTaskModal);

  return (
    <div className="flex min-w-[300px] flex-1 flex-col rounded-xl bg-gray-100">
      <ColumnHeader column={column} count={tasks.length} />
      <Droppable droppableId={column.status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2 px-3 pb-2 min-h-[100px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50/50 rounded-lg' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="px-3 pb-3">
        <AddTaskButton onClick={() => openTaskModal()} />
      </div>
    </div>
  );
}
