import { CheckCircle, XCircle } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export function Toast() {
  const toast = useUIStore((s) => s.toast);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${
        isSuccess
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200'
      }`}
    >
      {isSuccess ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}
