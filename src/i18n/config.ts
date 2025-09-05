export const locales = ["en", "es", "fr", "ko", "se"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];
