import { cn } from '@/lib/cn';
import { Button } from './Button';

export interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({ title, description, onRetry, retryLabel = 'Retry', className }: ErrorStateProps): JSX.Element {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start gap-3 rounded-lg border border-danger/25 bg-danger-soft/40 px-6 py-8',
        className,
      )}
    >
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="text-sm text-ink-muted">{description}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}