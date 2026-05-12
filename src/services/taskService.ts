import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

const STORAGE_KEY = 'tanstack-tasks';

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

function getTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export async function fetchTasks(signal?: AbortSignal): Promise<Task[]> {
  await delay(200, signal);
  return getTasks();
}

export async function fetchTask(id: string): Promise<Task> {
  await delay(100);
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error('Task not found');
  return task;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  await delay(150);
  const newTask: Task = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export async function updateTask(id: string, updates: UpdateTaskInput): Promise<Task> {
  await delay(150);
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Task not found');
  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  saveTasks(tasks);
  return tasks[index];
}

export async function deleteTask(id: string): Promise<void> {
  await delay(100);
  const tasks = getTasks();
  saveTasks(tasks.filter((t) => t.id !== id));
}
