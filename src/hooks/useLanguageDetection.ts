"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import {
  shouldShowGoogleTranslate,
  getUserPreferredLanguage,
  isI18nSupported,
  getLanguageName,
} from "@/utils/languageConfig";

export function useLanguageDetection() {
  const locale = useLocale();
  const [userPreferredLanguage, setUserPreferredLanguage] =
    useState<string>("en");
  const [showGoogleTranslate, setShowGoogleTranslate] =
    useState<boolean>(false);

  useEffect(() => {
    const preferredLang = getUserPreferredLanguage();
    const shouldShow = shouldShowGoogleTranslate(locale);

    setUserPreferredLanguage(preferredLang);
    setShowGoogleTranslate(shouldShow);
  }, [locale]);

  return {
    currentLocale: locale,
    userPreferredLanguage,
    showGoogleTranslate,
    isUserLanguageSupported: isI18nSupported(userPreferredLanguage),
    userLanguageName: getLanguageName(userPreferredLanguage),
  };
}
