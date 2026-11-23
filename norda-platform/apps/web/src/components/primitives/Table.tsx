import { cn } from '@/lib/cn';

export function Table({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-border-strong/15 bg-elevated', className)}>
      <table className="w-full text-sm text-start border-collapse">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }): JSX.Element {
  return <thead className="bg-surface text-ink-muted text-xs uppercase tracking-wider">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }): JSX.Element {
  return <tbody className="divide-y divide-border-strong/10">{children}</tbody>;
}

export function TR({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return <tr className={cn('transition-colors hover:bg-surface/50', className)}>{children}</tr>;
}

export function TH({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return <th scope="col" className={cn('text-start font-medium px-4 py-3', className)}>{children}</th>;
}

export function TD({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return <td className={cn('px-4 py-3 align-middle', className)}>{children}</td>;
}