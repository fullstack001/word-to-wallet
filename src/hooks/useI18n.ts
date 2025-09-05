import { useTranslations, useLocale } from 'next-intl';
import { locales } from '@/i18n/config';

export function useI18n() {
  const t = useTranslations();
  const locale = useLocale();

  const isCurrentLocale = (loc: string) => locale === loc;
  
  const getLocaleName = (loc: string) => {
    const names: Record<string, string> = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      ko: '한국어',
      se: 'Svenska'
    };
    return names[loc] || loc;
  };

  return {
    t,
    locale,
    locales,
    isCurrentLocale,
    getLocaleName
  };
} 