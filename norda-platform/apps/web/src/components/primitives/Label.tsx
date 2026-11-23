import { forwardRef } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/cn';

export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean;
  }
>(function Label({ className, children, required, ...rest }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'block text-sm font-medium text-ink mb-1.5',
        'peer-disabled:opacity-60',
        className,
      )}
      {...rest}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ms-0.5 text-danger">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  );
});