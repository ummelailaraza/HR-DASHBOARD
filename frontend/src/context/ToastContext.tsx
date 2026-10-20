'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  addToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  addToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message: message || title, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, addToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start justify-between gap-3 animate-slide-up transition-all ${
                isSuccess
                  ? 'bg-slate-900 text-white border-slate-700 dark:bg-slate-800 dark:border-slate-700'
                  : isError
                  ? 'bg-rose-950 text-white border-rose-800'
                  : isWarning
                  ? 'bg-amber-950 text-white border-amber-800'
                  : 'bg-blue-950 text-white border-blue-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isError && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  {isWarning && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
                  {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
                </div>
                <div>
                  {toast.title && (
                    <p className="text-xs font-bold leading-tight text-white">{toast.title}</p>
                  )}
                  <p className={`text-xs leading-relaxed ${toast.title ? 'text-slate-300 dark:text-slate-400 text-[11px] mt-0.5' : 'font-semibold text-white'}`}>
                    {toast.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
