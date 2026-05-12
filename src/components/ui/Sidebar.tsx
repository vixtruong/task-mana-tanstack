import { LayoutDashboard, Table2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export function Sidebar() {
  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-56' : 'w-0'
      } transition-all duration-200 bg-white border-r overflow-hidden flex flex-col shrink-0`}
    >
      <div className="p-4 border-b">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Views
        </h2>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        <button
          onClick={() => setViewMode('board')}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            viewMode === 'board'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard size={18} />
          Board
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            viewMode === 'table'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Table2 size={18} />
          Table
        </button>
      </nav>
    </aside>
  );
}
