import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid = false, className, rows = 5, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          'block w-full rounded-md bg-elevated text-ink placeholder:text-ink-faint',
          'border border-border-strong/25 px-3.5 py-3 text-sm leading-relaxed',
          'transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)]',
          'focus:outline-none focus:border-brand focus:ring-2 focus:ring-focus/30',
          'disabled:opacity-60 disabled:cursor-not-allowed resize-y min-h-[7rem]',
          invalid && 'border-danger/60 focus:border-danger focus:ring-danger/30',
          className,
        )}
        {...rest}
      />
    );
  },
);