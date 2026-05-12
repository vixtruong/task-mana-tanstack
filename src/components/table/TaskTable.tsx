import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2, Search } from 'lucide-react';
import { useTasks, useDeleteTask } from '../../hooks/useTasks';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../ui/Button';
import type { Task } from '../../types/task';

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

export function TaskTable() {
  const { data: tasks = [], isLoading } = useTasks();
  const deleteTask = useDeleteTask();
  const openTaskModal = useUIStore((s) => s.openTaskModal);
  const showToast = useUIStore((s) => s.showToast);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columnHelper = useMemo(() => createColumnHelper<Task>(), []);

  const displayDeleteTask = useMemo(
    () => (id: string) => {
      deleteTask.mutate(id);
      showToast('Task deleted');
    },
    [deleteTask, showToast],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting()}
          >
            Title
            <ArrowUpDown size={14} />
          </button>
        ),
      }),
      columnHelper.accessor('status', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting()}
          >
            Status
            <ArrowUpDown size={14} />
          </button>
        ),
        cell: (info) => {
          const val = info.getValue();
          return (
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                val === 'done'
                  ? 'bg-green-100 text-green-700'
                  : val === 'in-progress'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {STATUS_LABELS[val]}
            </span>
          );
        },
      }),
      columnHelper.accessor('priority', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting()}
          >
            Priority
            <ArrowUpDown size={14} />
          </button>
        ),
        cell: (info) => (
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${
              PRIORITY_COLORS[info.getValue()] || ''
            }`}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('assignee', {
        header: 'Assignee',
      }),
      columnHelper.accessor('createdAt', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting()}
          >
            Created
            <ArrowUpDown size={14} />
          </button>
        ),
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => openTaskModal(row.original.id)}
              className="rounded p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => displayDeleteTask(row.original.id)}
              className="rounded p-1 text-gray-400 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper, openTaskModal, displayDeleteTask],
  );

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-72">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left text-gray-600">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  No tasks found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
