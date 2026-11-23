import { cn } from '@/lib/cn';

type Width = 'prose' | 'content' | 'wide' | 'bleed' | 'full';

const widths: Record<Width, string> = {
  prose: 'max-w-prose',
  content: 'max-w-content',
  wide: 'max-w-wide',
  bleed: 'max-w-bleed',
  full: 'max-w-none',
};

export interface ContainerProps {
  width?: Width;
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function Container({ width = 'content', children, className, as }: ContainerProps): JSX.Element {
  const Tag = (as ?? 'div') as keyof JSX.IntrinsicElements;
  return (
    <Tag className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', widths[width], className)}>
      {children}
    </Tag>
  );
}