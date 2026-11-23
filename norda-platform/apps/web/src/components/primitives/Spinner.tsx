import { cn } from '@/lib/cn';

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }): JSX.Element {
  return (
    <span role="status" aria-label={label} className={cn('inline-block', className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="animate-spin text-brand"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}