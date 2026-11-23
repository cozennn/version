import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/cn';

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  label?: React.ReactNode;
  className?: string;
}

export function Switch({
  id,
  checked,
  onCheckedChange,
  disabled,
  name,
  label,
  className,
}: SwitchProps): JSX.Element {
  return (
    <label htmlFor={id} className={cn('inline-flex items-center gap-3 cursor-pointer', className)}>
      <SwitchPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        name={name}
        className={cn(
          'relative inline-flex h-6 w-10 shrink-0 items-center rounded-full',
          'bg-surface-2 border border-border-strong/20',
          'transition-colors duration-[var(--motion-fast)]',
          'data-[state=checked]:bg-brand data-[state=checked]:border-brand',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'block h-[1.125rem] w-[1.125rem] rounded-full bg-elevated shadow-xs',
            'transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)]',
            'translate-x-1 data-[state=checked]:translate-x-5',
            'rtl:data-[state=checked]:-translate-x-5 rtl:translate-x-[-0.25rem]',
          )}
        />
      </SwitchPrimitive.Root>
      {label && <span className="text-sm text-ink">{label}</span>}
    </label>
  );
}