import { useTranslation } from 'react-i18next';
import type { Locale } from '@norda/shared';

/**
 * Returns the current direction and locale. Used by components that
 * need physical-direction-aware behavior (icon mirroring, offset
 * calculations, and animation origins).
 */
export function useDirection(): { dir: 'rtl' | 'ltr'; locale: Locale } {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language === 'en' ? 'en' : 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return { dir, locale };
}