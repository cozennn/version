import { cn } from '@/lib/cn';

export interface SkeletonProps {
  className?: string;
  shape?: 'rect' | 'circle' | 'text';
}

export function Skeleton({ className, shape = 'rect' }: SkeletonProps): JSX.Element {
  const shapes = {
    rect: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded-xs',
  };
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-gradient-to-r from-surface via-surface-2 to-surface bg-[length:200%_100%] animate-shimmer',
        shapes[shape],
        className,
      )}
    />
  );
}