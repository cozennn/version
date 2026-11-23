import { cn } from '@/lib/cn';

export function Rule({ className, tone = 'default' }: { className?: string; tone?: 'default' | 'strong' }): JSX.Element {
  return (
    <hr
      className={cn(
        'border-0 h-px w-full',
        tone === 'default' ? 'bg-border-strong/15' : 'bg-border-strong/30',
        className,
      )}
    />
  );
}