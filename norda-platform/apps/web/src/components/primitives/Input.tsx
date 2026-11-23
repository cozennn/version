import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  invalid?: boolean;
  leadingAddon?: React.ReactNode;
  trailingAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className, leadingAddon, trailingAddon, ...rest },
  ref,
) {
  const input = (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'block w-full h-11 rounded-md bg-elevated text-ink placeholder:text-ink-faint',
        'border border-border-strong/25 px-3.5 text-sm',
        'transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)]',
        'focus:outline-none focus:border-brand focus:ring-2 focus:ring-focus/30',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        leadingAddon && 'ps-10',
        trailingAddon && 'pe-10',
        invalid && 'border-danger/60 focus:border-danger focus:ring-danger/30',
        className,
      )}
      {...rest}
    />
  );

  if (!leadingAddon && !trailingAddon) return input;

  return (
    <div className="relative">
      {leadingAddon && (
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-ink-faint">
          {leadingAddon}
        </span>
      )}
      {input}
      {trailingAddon && (
        <span className="absolute inset-y-0 end-3 flex items-center text-ink-faint">
          {trailingAddon}
        </span>
      )}
    </div>
  );
});