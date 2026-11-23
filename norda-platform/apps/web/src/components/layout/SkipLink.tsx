import { useTranslation } from 'react-i18next';

export function SkipLink(): JSX.Element {
  const { t } = useTranslation();
  return (
    <a href="#main-content" className="skip-link">
      {t('a11y.skipToContent')}
    </a>
  );
}