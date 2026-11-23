import { useTranslation } from 'react-i18next';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { DesignSystemPreview } from '@/components/preview/DesignSystemPreview';

/**
 * B1 home page — a design-system preview, not the final NorDa homepage.
 * The final Home (B4) replaces this component body entirely. Keeping the
 * preview at `/` in B1 lets AlphaCode visually validate the design system
 * against both locales and both directions before B2 lands.
 */
export function HomePage(): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      <Section tone="paper" spacing="xl">
        <Container>
          <p className="text-ink-muted text-sm uppercase tracking-[0.14em]">
            NorDa — Batch B1
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-display text-ink">
            {t('preview.title')}
          </h1>
          <p className="mt-6 max-w-prose text-lg text-ink-muted">
            {t('preview.intro')}
          </p>
        </Container>
      </Section>

      <DesignSystemPreview />
    </>
  );
}