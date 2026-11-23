import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return (
    <TabsPrimitive.List
      className={cn('flex items-center gap-1 border-b border-border-strong/15', className)}
    >
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }): JSX.Element {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        'relative px-3 py-2 text-sm text-ink-muted whitespace-nowrap',
        'data-[state=active]:text-ink data-[state=active]:font-medium',
        'hover:text-ink transition-colors',
        'after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-transparent',
        'data-[state=active]:after:bg-brand',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
      )}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }): JSX.Element {
  return (
    <TabsPrimitive.Content value={value} className="pt-5 focus-visible:outline-none">
      {children}
    </TabsPrimitive.Content>
  );
}