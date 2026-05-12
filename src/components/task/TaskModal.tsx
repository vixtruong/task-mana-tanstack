import { useState } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks';
import { useUIStore } from '../../store/uiStore';
import { Modal } from '../ui/Modal';
import { TaskForm } from './TaskForm';
import { Button } from '../ui/Button';
import type { TaskStatus, TaskPriority } from '../../types/task';

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
}

export function TaskModal() {
  const { taskModalOpen, editingTaskId, closeTaskModal, showToast } = useUIStore();
  const { data: tasks } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const editingTask = tasks?.find((t) => t.id === editingTaskId);
  const isEditing = !!editingTaskId;

  const handleSubmit = (data: TaskFormData) => {
    if (isEditing && editingTaskId) {
      updateTask.mutate(
        { id: editingTaskId, updates: data },
        {
          onSuccess: () => {
            closeTaskModal();
            showToast('Task updated successfully');
          },
          onError: () => showToast('Failed to update task', 'error'),
        },
      );
    } else {
      createTask.mutate(data, {
        onSuccess: () => {
          closeTaskModal();
          showToast('Task created successfully');
        },
        onError: () => showToast('Failed to create task', 'error'),
      });
    }
  };

  const handleDelete = () => {
    if (editingTaskId) {
      deleteTask.mutate(editingTaskId, {
        onSuccess: () => {
          closeTaskModal();
          showToast('Task deleted');
        },
        onError: () => showToast('Failed to delete task', 'error'),
      });
    }
  };

  const isPending = createTask.isPending || updateTask.isPending;

  return (
    <Modal
      open={taskModalOpen}
      onClose={closeTaskModal}
      title={isEditing ? 'Edit Task' : 'Create Task'}
    >
      {isEditing && confirmDelete ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this task?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteTask.isPending}
            >
              {deleteTask.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <TaskForm
            task={editingTask}
            onSubmit={handleSubmit}
            onCancel={closeTaskModal}
            isPending={isPending}
          />
          {isEditing && (
            <div className="mt-4 border-t pt-4">
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                Delete Task
              </Button>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
