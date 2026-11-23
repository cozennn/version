import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from './Container';

interface FooterLink {
  to: string;
  labelKey: string;
}

const EXPLORE: FooterLink[] = [
  { to: '/store', labelKey: 'nav.store' },
  { to: '/work', labelKey: 'nav.portfolio' },
  { to: '/services', labelKey: 'nav.services' },
];
const STUDIO: FooterLink[] = [
  { to: '/about', labelKey: 'nav.about' },
  { to: '/contact', labelKey: 'nav.contact' },
];

function FooterMark(): JSX.Element {
  return (
    <svg viewBox="0 0 44 44" className="h-11 w-11 text-brand" fill="none" aria-hidden="true">
      <path d="M22 37C13.5 30.5 9.5 23 13 16.5C16 11 21 11 22 18C23 11 28 11 31 16.5C34.5 23 30.5 30.5 22 37Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M22 37C19 27.5 19 18 22 7C25 18 25 27.5 22 37Z" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M22 37V42" stroke="#C2648A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function SiteFooter(): JSX.Element {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto overflow-hidden border-t border-border-strong/10 bg-paper">
      <Container width="wide">
        <div className="grid gap-12 py-14 md:grid-cols-[1.3fr_.7fr_.7fr] md:py-20">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-3" aria-label={t('app.name')}>
              <FooterMark/>
              <span className="font-display text-2xl font-bold tracking-tight text-ink">{t('app.name')}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-ink-muted">{t('app.tagline')}</p>
            <Link to="/contact" className="mt-7 inline-flex items-center gap-3 border-b border-rose pb-2 text-sm font-semibold text-ink transition-colors hover:text-brand">{t('home.contact.link')} <span aria-hidden="true">↗</span></Link>
          </div>
          <FooterColumn title={t('footer.explore')} links={EXPLORE}/>
          <FooterColumn title={t('footer.studio')} links={STUDIO}/>
        </div>
        <div className="flex flex-col gap-3 border-t border-ink/10 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-ink-muted">© {year} {t('app.name')}. {t('footer.rights')}</p>
          <p className="text-[10px] font-semibold tracking-[.12em] text-ink-faint">{t('app.tagline')}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }): JSX.Element {
  const { t } = useTranslation();
  return (
    <div>
      <p className="text-xs font-semibold text-ink">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="group inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-brand">
              {t(link.labelKey)} <span aria-hidden="true" className="opacity-0 transition-opacity group-hover:opacity-100">↗</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
