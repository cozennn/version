import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES, type Locale } from '@norda/shared';
import { cn } from '@/lib/cn';

export function LanguageSwitcher({ className }: { className?: string }): JSX.Element {
  const { i18n, t } = useTranslation();
  const current: Locale = i18n.language === 'en' ? 'en' : 'ar';

  const change = (locale: Locale): void => {
    if (locale === current) return;
    void i18n.changeLanguage(locale);
  };

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className={cn(
        'inline-flex items-center rounded-md border border-border-strong/20 bg-elevated p-0.5',
        className,
      )}
    >
      {SUPPORTED_LOCALES.map((locale) => {
        const active = locale === current;
        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            onClick={() => change(locale)}
            aria-pressed={active}
            className={cn(
              'h-7 px-2.5 rounded-sm text-xs font-medium transition-colors duration-[var(--motion-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1',
              active
                ? 'bg-ink text-paper'
                : 'text-ink-muted hover:text-ink hover:bg-surface',
            )}
          >
            {t(`language.${locale}`)}
          </button>
        );
      })}
    </div>
  );
}