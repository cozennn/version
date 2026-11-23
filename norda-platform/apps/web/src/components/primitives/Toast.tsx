import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';

type ToastTone = 'neutral' | 'success' | 'danger' | 'info';
interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  push: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, tone: ToastTone = 'neutral') => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 4500);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  const toneClass: Record<ToastTone, string> = {
    neutral: 'bg-ink text-paper',
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
    info: 'bg-info text-white',
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 end-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none"
      >
        {items.map((item) => (
          <div
            key={item.id}
            role="status"
            className={cn(
              'pointer-events-auto rounded-md px-4 py-3 text-sm shadow-md animate-rise-in',
              toneClass[item.tone],
            )}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}