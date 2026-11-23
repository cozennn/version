import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface ChipProps { children: ReactNode; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger'; size?: 'sm' | 'md'; className?: string; }
export function Chip({ children, tone='neutral', size='md', className }: ChipProps): JSX.Element {
  const tones = { neutral: 'bg-surface text-ink-muted', brand: 'bg-brand-soft text-brand-strong', success: 'bg-success-soft text-success', warning: 'bg-warning-soft text-warning', danger: 'bg-danger-soft text-danger' };
  return <span className={cn('inline-flex w-fit items-center rounded-full font-medium', size==='sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm', tones[tone], className)}>{children}</span>;
}