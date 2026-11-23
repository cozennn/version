import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/primitives/Toast';
import { SkipLink } from './SkipLink';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

/**
 * The public application shell. Admin uses a different shell in B9.
 * Every route rendered inside <AppShell> gets the same header/footer,
 * skip-link, and toast provider — the invariant of the NorDa brand.
 */
export function AppShell({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ThemeProvider>
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-paper text-ink">
        <SkipLink />
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </div>
    </ToastProvider>
    </ThemeProvider>
  );
}