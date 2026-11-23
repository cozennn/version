import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/cn';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  name?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function RadioGroup({
  value,
  onValueChange,
  options,
  name,
  disabled,
  className,
  'aria-label': ariaLabel,
}: RadioGroupProps): JSX.Element {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn('flex flex-col gap-2', className)}
    >
      {options.map((opt) => {
        const id = `${name ?? 'radio'}-${opt.value}`;
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={cn(
              'flex items-start gap-3 rounded-md border border-border-strong/20 bg-elevated px-3.5 py-3 cursor-pointer',
              'transition-[border-color,background-color] duration-[var(--motion-fast)]',
              'hover:border-border-strong/40',
              'has-[:checked]:border-brand has-[:checked]:bg-brand-soft/40',
              opt.disabled && 'opacity-60 cursor-not-allowed',
            )}
          >
            <RadioGroupPrimitive.Item
              id={id}
              value={opt.value}
              disabled={opt.disabled}
              className={cn(
                'mt-0.5 h-4 w-4 shrink-0 rounded-full bg-elevated',
                'border border-border-strong/40',
                'data-[state=checked]:border-brand',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
              )}
            >
              <RadioGroupPrimitive.Indicator className="flex h-full w-full items-center justify-center">
                <span className="block h-2 w-2 rounded-full bg-brand" />
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
            <span className="flex-1">
              <span className="block text-sm text-ink">{opt.label}</span>
              {opt.hint && (
                <span className="mt-0.5 block text-xs text-ink-muted">{opt.hint}</span>
              )}
            </span>
          </label>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
}