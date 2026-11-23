import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/cn';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'start' | 'end';
  delayMs?: number;
}

export function Tooltip({ content, children, side = 'top', delayMs = 200 }: TooltipProps): JSX.Element {
  return (
    <TooltipPrimitive.Provider delayDuration={delayMs}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-50 max-w-xs rounded-sm bg-ink px-2.5 py-1.5 text-xs text-paper shadow-sm',
              'data-[state=delayed-open]:animate-fade-in',
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-ink" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}