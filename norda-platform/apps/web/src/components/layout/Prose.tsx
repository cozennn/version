import { cn } from '@/lib/cn';

/**
 * Long-form content (case studies, service pages, terms). Not a
 * typography plugin clone — deliberately scoped to `[&_x]` selectors
 * so we control every element and don't ship a 3 kB prose CSS.
 */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return (
    <div
      className={cn(
        'max-w-prose text-ink',
        'text-base leading-relaxed',
        '[&_p]:my-4 [&_p]:text-ink-muted [&_p]:leading-relaxed',
        '[&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink',
        '[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink',
        '[&_ul]:my-4 [&_ul]:ps-6 [&_ul]:list-disc',
        '[&_ol]:my-4 [&_ol]:ps-6 [&_ol]:list-decimal',
        '[&_li]:my-1.5 [&_li]:text-ink-muted',
        '[&_blockquote]:my-6 [&_blockquote]:border-s-2 [&_blockquote]:border-brand [&_blockquote]:ps-4 [&_blockquote]:italic [&_blockquote]:text-ink',
        '[&_code]:rounded-xs [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:font-mono',
        '[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-brand-strong',
        className,
      )}
    >
      {children}
    </div>
  );
}