import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from './Container';
import { Rule } from './Rule';

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

export function SiteFooter(): JSX.Element {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border-strong/10 bg-paper">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-4 md:py-16">
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-bold text-ink">{t('app.name')}</p>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">{t('app.tagline')}</p>
          </div>
          <FooterColumn title={t('footer.explore')} links={EXPLORE} />
          <FooterColumn title={t('footer.studio')} links={STUDIO} />
        </div>
        <Rule />
        <div className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-ink-muted">
            © {year} {t('app.name')}. {t('footer.rights')}
          </p>

        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }): JSX.Element {
  const { t } = useTranslation();
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-ink hover:text-brand">
              {t(l.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}