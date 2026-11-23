import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/cn';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export interface DropdownItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export function DropdownItem({ children, onSelect, disabled, destructive }: DropdownItemProps): JSX.Element {
  return (
    <DropdownMenuPrimitive.Item
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        'relative flex items-center gap-2 h-9 px-2.5 text-sm rounded-sm cursor-pointer outline-none select-none',
        'text-ink data-[highlighted]:bg-surface',
        'data-[disabled]:opacity-40 data-[disabled]:pointer-events-none',
        destructive && 'text-danger data-[highlighted]:bg-danger-soft',
      )}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownSeparator(): JSX.Element {
  return <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border-strong/10" />;
}

export function DropdownContent({ children, align = 'end' }: { children: React.ReactNode; align?: 'start' | 'center' | 'end' }): JSX.Element {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={6}
        className="z-50 min-w-[10rem] rounded-md bg-elevated border border-border-strong/20 shadow-md p-1 data-[state=open]:animate-fade-in"
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}