import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
export function Cluster({ children, gap='0.75rem', align='center', justify='flex-start', className }: { children: ReactNode; gap?: string; align?: CSSProperties['alignItems']; justify?: CSSProperties['justifyContent']; className?: string }): JSX.Element {
  return <div className={cn('flex flex-wrap',className)} style={{ gap, alignItems: align, justifyContent: justify }}>{children}</div>;
}