import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  className?: string;
  'aria-describedby'?: string;
}

export function Select({
  value,
  onValueChange,
  placeholder,
  options,
  disabled,
  invalid,
  name,
  id,
  className,
  'aria-describedby': describedBy,
}: SelectProps): JSX.Element {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
    >
      <SelectPrimitive.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          'inline-flex items-center justify-between gap-2 w-full h-11 rounded-md',
          'bg-elevated text-ink border border-border-strong/25 px-3.5 text-sm',
          'transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)]',
          'focus:outline-none focus:border-brand focus:ring-2 focus:ring-focus/30',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          invalid && 'border-danger/60',
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-ink-faint shrink-0"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className={cn(
            'z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden',
            'rounded-md bg-elevated border border-border-strong/20 shadow-md',
            'data-[state=open]:animate-fade-in',
          )}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className={cn(
                  'relative flex items-center h-9 px-3 text-sm rounded-sm cursor-pointer select-none',
                  'text-ink data-[highlighted]:bg-surface data-[disabled]:opacity-40',
                  'data-[state=checked]:font-medium',
                )}
              >
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}