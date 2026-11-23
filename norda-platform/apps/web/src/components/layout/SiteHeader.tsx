import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { Container } from './Container';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useDirection } from '@/lib/useDirection';
import { useTheme } from '@/components/providers/ThemeProvider';

interface NavItem {
  to: string;
  labelKey: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/store', labelKey: 'nav.store' },
  { to: '/work', labelKey: 'nav.portfolio' },
  { to: '/services', labelKey: 'nav.services' },
  { to: '/about', labelKey: 'nav.about' },
  { to: '/contact', labelKey: 'nav.contact' },
];

export function SiteHeader(): JSX.Element {
  const { t } = useTranslation();
  const { dir } = useDirection();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-border-strong/10 bg-paper/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-[var(--header-height-mobile)] items-center justify-between gap-4 md:h-[var(--header-height)]">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            aria-label={t('app.name')}
          >
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center text-brand">
              <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none">
                <path d="M20 34C12.8 28.5 9 22.4 11.8 16.6C14.2 11.5 19 10.7 20 17.1C21 10.7 25.8 11.5 28.2 16.6C31 22.4 27.2 28.5 20 34Z" fill="currentColor" fillOpacity=".14" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M20 34C17.5 26.3 17.5 18.8 20 9C22.5 18.8 22.5 26.3 20 34Z" fill="currentColor" fillOpacity=".22" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M20 34V38" stroke="#C2648A" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="20" cy="19" r="2.2" fill="#C2648A"/>
              </svg>
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink">{t('app.name')}</span>
          </Link>

          <nav aria-label={t('nav.menu')} className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-sm px-3 py-2 text-sm transition-colors duration-[var(--motion-fast)] after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-brand after:transition-transform after:duration-200 aria-[current=page]:after:scale-x-100',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
                    isActive ? 'font-semibold text-brand' : 'text-ink-muted hover:text-ink',
                  )
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label={t('theme.toggle')}
              title={t('theme.toggle')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-strong/20 text-ink-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z"/>
                </svg>
              )}
            </button>
            <LanguageSwitcher className="hidden sm:inline-flex" />

            <button
              type="button"
              aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-strong/20 bg-elevated text-ink transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 md:hidden"
            >
              {mobileOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            id="mobile-nav"
            className="overflow-hidden border-t border-border-strong/10 pb-5 pt-4 md:hidden"
          >
            <div className="mb-3 flex items-center justify-between gap-4 px-3">
              <span className="text-[10px] font-bold uppercase tracking-[.2em] text-brand">{t('nav.menu')}</span>
              <span className="text-[10px] text-ink-faint">{t('app.tagline')}</span>
            </div>
            <nav aria-label={t('nav.menu')} className="flex flex-col">
              {NAV_ITEMS.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'group grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 border-b border-ink/10 px-3 py-3.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
                      isActive ? 'bg-surface font-semibold text-brand' : 'text-ink-muted hover:bg-surface hover:text-ink',
                    )
                  }
                >
                  <span className="font-mono text-[10px] text-rose/80">0{index + 1}</span>
                  <span>{t(item.labelKey)}</span>
                  <span aria-hidden="true" className="text-base text-rose transition-transform group-hover:-translate-x-1">↗</span>
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 flex items-center justify-between gap-3 px-3">
              <LanguageSwitcher />
              <span className="text-[10px] text-ink-faint">{t('app.name')}</span>
            </div>
          </div>
        )}
      </Container>
      <span className="sr-only" dir={dir}>{t('app.tagline')}</span>
    </header>
  );
}
