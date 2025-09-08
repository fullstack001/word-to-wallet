import { locales, googleTranslateCodes, localeNames } from "@/i18n/config";

// Extended Google Translate language codes mapping for additional languages
export const EXTENDED_GOOGLE_TRANSLATE_CODES: Record<string, string> = {
  // Your supported locales (from config)
  ...googleTranslateCodes,
  // Additional languages that might be detected
  zh: "zh",
  cs: "cs",
  nl: "nl",
  de: "de",
  el: "el",
  hu: "hu",
  id: "id",
  it: "it",
  ja: "ja",
  ms: "ms",
  pl: "pl",
  pt: "pt",
  ro: "ro",
  sr: "sr",
  th: "th",
  tr: "tr",
  uk: "uk",
  vi: "vi",
  fi: "fi",
};

// Extended language names for display
export const EXTENDED_LANGUAGE_NAMES: Record<string, string> = {
  // Your supported locales (from config)
  ...localeNames,
  // Additional languages
  zh: "中文",
  cs: "Čeština",
  nl: "Nederlands",
  de: "Deutsch",
  el: "Ελληνικά",
  hu: "Magyar",
  id: "Bahasa Indonesia",
  it: "Italiano",
  ja: "日本語",
  ms: "Bahasa Melayu",
  pl: "Polski",
  pt: "Português",
  ro: "Română",
  sr: "Srpski",
  th: "แบบไทย",
  tr: "Türkçe",
  uk: "Українська",
  vi: "Tiếng Việt",
  fi: "Suomi",
};

/**
 * Check if a language code is supported by your i18n system
 */
export function isI18nSupported(languageCode: string): boolean {
  return locales.includes(languageCode as any);
}

/**
 * Get the Google Translate language code for a given language
 */
export function getGoogleTranslateCode(languageCode: string): string {
  return EXTENDED_GOOGLE_TRANSLATE_CODES[languageCode] || languageCode;
}

/**
 * Get the display name for a language code
 */
export function getLanguageName(languageCode: string): string {
  return EXTENDED_LANGUAGE_NAMES[languageCode] || languageCode;
}

/**
 * Detect user's preferred language from browser
 */
export function getUserPreferredLanguage(): string {
  if (typeof window === "undefined") return "en";

  // Try to get from navigator.languages (most accurate)
  const browserLanguages = navigator.languages || [navigator.language];

  for (const lang of browserLanguages) {
    // Extract just the language code (e.g., "en-US" -> "en")
    const languageCode = lang.split("-")[0].toLowerCase();

    // Check if it's supported by our i18n
    if (isI18nSupported(languageCode)) {
      return languageCode;
    }
  }

  // Fallback to navigator.language
  const fallbackLang = navigator.language.split("-")[0].toLowerCase();
  return isI18nSupported(fallbackLang) ? fallbackLang : "en";
}

/**
 * Check if Google Translate should be shown for the current user
 * Returns true if user's preferred language is NOT supported by i18n
 */
export function shouldShowGoogleTranslate(currentLocale: string): boolean {
  const userPreferredLang = getUserPreferredLanguage();

  // If user's preferred language is already supported, don't show Google Translate
  if (isI18nSupported(userPreferredLang)) {
    return false;
  }

  // If current locale is not the user's preferred language, show Google Translate
  return currentLocale !== userPreferredLang;
}
