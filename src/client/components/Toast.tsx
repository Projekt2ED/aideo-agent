import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 入场动画
    requestAnimationFrame(() => setIsVisible(true));
    
    // 自动消失
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 150);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: <CheckCircle2 size={18} className="text-green-600" strokeWidth={3} />,
    error: <XCircle size={18} className="text-red-600" strokeWidth={3} />,
    warning: <AlertCircle size={18} className="text-yellow-600" strokeWidth={3} />,
    info: <Info size={18} className="text-purple-600" strokeWidth={3} />,
  };

  const borderColors = {
    success: 'border-l-green-600',
    error: 'border-l-red-600',
    warning: 'border-l-yellow-600',
    info: 'border-l-purple-600',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-white border-2 border-black border-l-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 font-display ${
        borderColors[toast.type]
      } ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}
    >
      {icons[toast.type]}
      <span className="flex-1 text-sm font-bold text-black">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
      >
        <X size={14} strokeWidth={3} className="text-gray-500" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
