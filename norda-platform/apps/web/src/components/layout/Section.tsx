import { cn } from '@/lib/cn';

type Tone = 'paper' | 'surface' | 'elevated' | 'brand-soft' | 'ink';
type Spacing = 'sm' | 'md' | 'lg' | 'xl';

const tones: Record<Tone, string> = {
  paper: 'bg-paper text-ink',
  surface: 'bg-surface text-ink',
  elevated: 'bg-elevated text-ink',
  'brand-soft': 'bg-brand-soft text-ink',
  ink: 'bg-ink text-paper',
};

const spacings: Record<Spacing, string> = {
  sm: 'py-10 md:py-14',
  md: 'py-14 md:py-20',
  lg: 'py-20 md:py-28',
  xl: 'py-24 md:py-36',
};

export interface SectionProps {
  tone?: Tone;
  spacing?: Spacing;
  as?: keyof JSX.IntrinsicElements;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export function Section({ tone = 'paper', spacing = 'lg', as, id, className, children }: SectionProps): JSX.Element {
  const Tag = (as ?? 'section') as keyof JSX.IntrinsicElements;
  return (
    <Tag id={id} className={cn(tones[tone], spacings[spacing], className)}>
      {children}
    </Tag>
  );
}