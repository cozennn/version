import { useId } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/lib/cn';

export interface CheckboxProps {
  id?: string;
  checked?: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  disabled?: boolean;
  name?: string;
  value?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  'aria-describedby'?: string;
  className?: string;
}

export function Checkbox({
  id,
  checked,
  onCheckedChange,
  disabled,
  name,
  value,
  label,
  hint,
  error,
  required,
  'aria-describedby': describedBy,
  className,
}: CheckboxProps): JSX.Element {
  const generatedId = useId();
  const controlId = id ?? `norda-checkbox-${generatedId}`;
  const descIds: string[] = [];
  if (hint) descIds.push(`${controlId}-hint`);
  if (error) descIds.push(`${controlId}-error`);
  if (describedBy) descIds.push(describedBy);

  return (
    <div className={cn('flex flex-col', className)}>
      <label className="inline-flex items-start gap-2.5 cursor-pointer select-none">
        <CheckboxPrimitive.Root
          id={controlId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          name={name}
          value={value}
          required={required}
          aria-describedby={descIds.length ? descIds.join(' ') : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            'peer inline-flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded-xs',
            'bg-elevated border border-border-strong/40',
            'transition-colors duration-[var(--motion-fast)]',
            'data-[state=checked]:bg-brand data-[state=checked]:border-brand',
            'data-[state=indeterminate]:bg-brand data-[state=indeterminate]:border-brand',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger/70',
          )}
        >
          <CheckboxPrimitive.Indicator className="text-white">
            {checked === 'indeterminate' ? (
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <rect x="2" y="4.5" width="6" height="1.5" fill="currentColor" />
              </svg>
            ) : (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="m1.5 5 2.5 2.5 4.5-5" />
              </svg>
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && <span className="text-sm text-ink leading-snug">{label}</span>}
      </label>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 ms-[1.625rem] text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 ms-6.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}