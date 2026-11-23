import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/cn';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onOpenChange, title, description, children, footer, size = 'md' }: ModalProps): JSX.Element {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-x-4 top-[10vh] z-50 mx-auto w-full rounded-lg bg-elevated shadow-md',
            'border border-border-strong/15',
            'data-[state=open]:animate-rise-in',
            sizes[size],
          )}
        >
          <div className="border-b border-border-strong/10 px-6 py-4">
            <DialogPrimitive.Title className="text-lg font-semibold text-ink">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="mt-1 text-sm text-ink-muted">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <div className="px-6 py-5">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-border-strong/10 px-6 py-4">
              {footer}
            </div>
          )}
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface focus-visible:ring-2 focus-visible:ring-focus"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}