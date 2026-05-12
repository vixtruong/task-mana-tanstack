import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as taskService from '../services/taskService';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

/* ── Query Key Factory ──────────────────────────── */
// Single source of truth for all query keys.
// Collocation: keys sit next to their hooks so changes stay in sync.
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

/* ── Queries ────────────────────────────────────── */

/** Fetch the full task list. */
export function useTasks() {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: ({ signal }) => taskService.fetchTasks(signal),
    staleTime: 1000 * 60 * 2,   // 2 min – board doesn't change every keystroke
    gcTime: 1000 * 60 * 10,      // 10 min keep in cache after unmount
  });
}

/** Fetch a single task (useful for detail views). */
export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(id!),
    queryFn: () => taskService.fetchTask(id!),
    enabled: !!id,
  });
}

/* ── Mutations (all with optimistic updates) ────── */

/**
 * Helper: snapshot the list cache, apply an optimistic update,
 * and return the snapshot so `onError` can roll back.
 */
function optimisticUpdate(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (old: Task[] | undefined) => Task[] | undefined,
): { previous: Task[] | undefined } {
  const previous = queryClient.getQueryData<Task[]>(taskKeys.lists());
  queryClient.setQueryData<Task[]>(taskKeys.lists(), updater);
  return { previous };
}

/** Create a task — instant feedback in the UI. */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskService.createTask(input),

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      return optimisticUpdate(queryClient, (old) => {
        const optimistic: Task = {
          ...input,
          id: `optimistic-${crypto.randomUUID()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return old ? [...old, optimistic] : [optimistic];
      });
    },

    onError: (_err, _input, context) => {
      // Rollback to snapshot
      if (context?.previous) {
        queryClient.setQueryData(taskKeys.lists(), context.previous);
      }
    },

    onSettled: () => {
      // Re-fetch from source to replace optimistic entry with real data
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

/** Update a task — used by both the edit modal and drag-and-drop. */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskInput }) =>
      taskService.updateTask(id, updates),

    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      return optimisticUpdate(queryClient, (old) =>
        old?.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task,
        ) ?? [],
      );
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(taskKeys.lists(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

/** Delete a task. */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      return optimisticUpdate(queryClient, (old) =>
        old?.filter((t) => t.id !== id) ?? [],
      );
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(taskKeys.lists(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
