import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/cn';
import { useDirection } from '@/lib/useDirection';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  side?: 'start' | 'end';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  side = 'end',
  children,
  footer,
}: DrawerProps): JSX.Element {
  const { dir } = useDirection();
  // "start" means reading-start: right in RTL, left in LTR.
  const resolvedSide =
    side === 'start'
      ? dir === 'rtl'
        ? 'right'
        : 'left'
      : dir === 'rtl'
        ? 'left'
        : 'right';

  const sideClasses =
    resolvedSide === 'right'
      ? 'inset-y-0 end-0 data-[state=closed]:translate-x-full rtl:data-[state=closed]:-translate-x-full'
      : 'inset-y-0 start-0 data-[state=closed]:-translate-x-full rtl:data-[state=closed]:translate-x-full';

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-ink/40 data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 flex flex-col w-full max-w-sm bg-elevated shadow-md',
            'border-s border-border-strong/15',
            'transition-transform duration-[var(--motion-base)] ease-[var(--ease-out)]',
            sideClasses,
          )}
        >
          <div className="flex items-start justify-between gap-3 border-b border-border-strong/10 px-5 py-4">
            <div>
              <DialogPrimitive.Title className="text-base font-semibold text-ink">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-0.5 text-xs text-ink-muted">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="border-t border-border-strong/10 px-5 py-4">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}