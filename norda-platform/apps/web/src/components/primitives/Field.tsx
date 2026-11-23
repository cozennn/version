import { cn } from '@/lib/cn';

export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A field wrapper: label, control, hint, error — with correct spacing
 * and accessible error association (aria-describedby is set by callers
 * via the control's `id`).
 */
export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: FieldProps): JSX.Element {
  return (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink mb-1.5">
          {label}
          {required && (
            <span aria-hidden="true" className="ms-0.5 text-danger">*</span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>
      )}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}