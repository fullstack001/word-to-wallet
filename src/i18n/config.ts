export const locales = ["en", "es", "fr", "ko", "se"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

// Google Translate language codes mapping for supported locales
export const googleTranslateCodes: Record<Locale, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  ko: "ko",
  se: "sv", // Swedish in Google Translate
} as const;

// Language display names for supported locales
export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  ko: "한국어",
  se: "Svenska",
} as const;
