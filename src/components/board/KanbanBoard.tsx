import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useTasks, useUpdateTask } from '../../hooks/useTasks';
import { Column } from './Column';
import { COLUMNS } from '../../types/task';
import type { TaskStatus } from '../../types/task';

export function KanbanBoard() {
  const { data: tasks = [], isLoading } = useTasks();
  const updateTask = useUpdateTask();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    updateTask.mutate({
      id: draggableId,
      updates: { status: destination.droppableId as TaskStatus },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-6 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasks.filter((t) => t.status === col.status)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
