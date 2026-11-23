import { useState } from 'react';
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

  return (
    <header className="sticky top-0 z-30 border-b border-border-strong/10 bg-paper">
      <Container>
        <div className="flex h-[var(--header-height-mobile)] md:h-[var(--header-height)] items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 rounded-sm"
            aria-label={t('app.name')}
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-paper font-display font-bold text-sm"
            >
              N
            </span>
            <span className="font-display font-bold text-lg tracking-tight text-ink">
              {t('app.name')}
            </span>
          </Link>

          <nav aria-label={t('nav.menu')} className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative px-3 py-2 text-sm rounded-sm transition-colors duration-[var(--motion-fast)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
                    isActive
                      ? 'text-ink font-medium'
                      : 'text-ink-muted hover:text-ink hover:bg-surface',
                  )
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={t('theme.toggle')} title={t('theme.toggle')} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-strong/20 text-ink-muted hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">
              <span aria-hidden="true">{theme === 'light' ? '◐' : '☼'}</span>
            </button>
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <Link
              to="/account"
              className="hidden md:inline-flex h-9 items-center px-3 rounded-md text-sm text-ink-muted hover:text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              {t('nav.account')}
            </Link>
            <Link
              to="/cart"
              className="relative inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm text-ink bg-elevated border border-border-strong/20 hover:border-border-strong/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
                <path d="M6 6 5 3H2" />
              </svg>
              <span className="hidden sm:inline">{t('nav.cart')}</span>
            </Link>
            <button
              type="button"
              aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-strong/20 bg-elevated text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              {mobileOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-border-strong/10 pb-4 pt-2 animate-fade-in"
          >
            <nav aria-label={t('nav.menu')} className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-2 py-2.5 text-sm rounded-sm',
                      isActive ? 'text-ink font-medium bg-surface' : 'text-ink-muted hover:bg-surface',
                    )
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between gap-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </Container>
      <span className="sr-only" dir={dir}>
        {t('app.tagline')}
      </span>
    </header>
  );
}