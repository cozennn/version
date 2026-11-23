import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium ' +
  'transition-[background-color,border-color,color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper ' +
  'disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-white border border-transparent shadow-xs ' +
    'hover:bg-brand-strong',
  secondary:
    'bg-elevated text-ink border border-border-strong/20 shadow-xs ' +
    'hover:border-border-strong/40 hover:bg-surface',
  ghost:
    'bg-transparent text-ink border border-transparent ' +
    'hover:bg-surface',
  danger:
    'bg-danger text-white border border-transparent shadow-xs ' +
    'hover:brightness-95',
  link:
    'bg-transparent text-brand border-0 underline-offset-4 ' +
    'hover:underline focus-visible:ring-offset-0',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-md',
  md: 'h-11 px-5 text-sm rounded-md',
  lg: 'h-12 px-6 text-base rounded-md',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    asChild = false,
    loading = false,
    leadingIcon,
    trailingIcon,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </Comp>
  );
});