import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckIcon, CloseIcon, InfoIcon } from '../../icons';

type ToastKind = 'success' | 'error' | 'info';
type Toast = { id: string; message: string; kind: ToastKind };

type ToastContextValue = {
  notify: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const styles: Record<ToastKind, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-red-200 bg-red-50 text-red-900',
  info: 'border-navy-900/10 bg-white text-navy-900',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-4 z-[90] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2 sm:left-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13px] shadow-soft ${styles[toast.kind]}`}
          >
            <span className="mt-0.5 shrink-0">
              {toast.kind === 'success' ? <CheckIcon className="h-4 w-4" /> : null}
              {toast.kind === 'error' ? <CloseIcon className="h-4 w-4" /> : null}
              {toast.kind === 'info' ? <InfoIcon className="h-4 w-4" /> : null}
            </span>
            <p className="leading-6">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
