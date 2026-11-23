import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@norda/shared';
import ar from './ar.json';
import en from './en.json';

export const LOCALE_STORAGE_KEY = 'norda.locale';

/**
 * Apply locale to the <html> element. Called on init and on change.
 * We set both `lang` and `dir` — some browsers derive direction from
 * `dir` alone, some from `lang`; setting both is the safest.
 */
export function applyDocumentLocale(locale: Locale): void {
  const html = document.documentElement;
  html.setAttribute('lang', locale);
  html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES as unknown as string[],
    nonExplicitSupportedLngs: false,
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: {
      // Order matters: user's explicit choice wins, then browser, then default.
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: LOCALE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  })
  .then(() => {
    applyDocumentLocale(i18n.language as Locale);
  })
  .catch(() => {
    // If init fails for any reason, still enforce a usable direction.
    applyDocumentLocale(DEFAULT_LOCALE);
  });

i18n.on('languageChanged', (lng) => {
  applyDocumentLocale(lng as Locale);
});

export default i18n;