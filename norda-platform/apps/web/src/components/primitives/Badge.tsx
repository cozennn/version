import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'brand' | 'rose' | 'success' | 'warning' | 'danger' | 'info' | 'demo';
type Size = 'sm' | 'md';

export interface BadgeProps {
  tone?: Tone;
  size?: Size;
  children: React.ReactNode;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral: 'bg-surface text-ink-muted border-border-strong/20',
  brand: 'bg-brand-soft text-brand-strong border-brand/20',
  rose: 'bg-rose-soft text-rose border-rose/25',
  success: 'bg-success-soft text-success border-success/20',
  warning: 'bg-warning-soft text-warning border-warning/20',
  danger: 'bg-danger-soft text-danger border-danger/20',
  info: 'bg-info-soft text-info border-info/20',
  demo: 'bg-warning-soft text-warning border-warning/30',
};

const sizes: Record<Size, string> = {
  sm: 'h-5 px-1.5 text-[0.6875rem] tracking-wide',
  md: 'h-6 px-2 text-xs',
};

export function Badge({ tone = 'neutral', size = 'sm', children, className }: BadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium whitespace-nowrap',
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}