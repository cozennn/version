import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/primitives/Button';

export function NotFoundPage(): JSX.Element {
  const { t } = useTranslation();
  return (
    <Section tone="paper" spacing="xl">
      <Container>
        <p className="text-sm uppercase tracking-[0.14em] text-ink-muted">404</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-display text-ink">
          {t('notFound.title')}
        </h1>
        <p className="mt-4 max-w-prose text-ink-muted">{t('notFound.body')}</p>
        <div className="mt-8">
          <Link to="/">
            <Button variant="primary">{t('notFound.backHome')}</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}