import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
export function Grid({ children, minColumnWidth='15rem', gap='1.25rem', className }: { children: ReactNode; minColumnWidth?: string; gap?: string; className?: string }): JSX.Element {
  const style: CSSProperties = { gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minColumnWidth}), 1fr))`, gap };
  return <div className={cn('grid',className)} style={style}>{children}</div>;
}