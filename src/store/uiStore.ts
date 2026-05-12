import { create } from 'zustand';

type ViewMode = 'board' | 'table';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

interface UIState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  taskModalOpen: boolean;
  editingTaskId: string | null;
  openTaskModal: (taskId?: string) => void;
  closeTaskModal: () => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const useUIStore = create<UIState>((set) => ({
  viewMode: 'board',
  setViewMode: (mode) => set({ viewMode: mode }),
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  taskModalOpen: false,
  editingTaskId: null,
  openTaskModal: (taskId) => set({ taskModalOpen: true, editingTaskId: taskId ?? null }),
  closeTaskModal: () => set({ taskModalOpen: false, editingTaskId: null }),
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
}));
