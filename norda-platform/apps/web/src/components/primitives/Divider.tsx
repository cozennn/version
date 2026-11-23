import { cn } from '@/lib/cn';
export interface DividerProps { orientation?: 'horizontal' | 'vertical'; decorative?: boolean; className?: string; }
export function Divider({ orientation='horizontal', decorative=true, className }: DividerProps): JSX.Element {
  return <div role={decorative ? undefined : 'separator'} aria-orientation={decorative ? undefined : orientation} aria-hidden={decorative ? true : undefined} className={cn('shrink-0 bg-border-strong/15', orientation==='horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch', className)} />;
}