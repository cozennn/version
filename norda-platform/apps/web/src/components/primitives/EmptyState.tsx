import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center rounded-lg border border-dashed border-border-strong/25 bg-elevated/50 px-6 py-14',
        className,
      )}
    >
      {icon && <div className="mb-4 text-ink-faint">{icon}</div>}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}