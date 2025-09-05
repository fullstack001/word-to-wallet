"use client";
import { useEffect } from "react";

export default function LanguageSetter({ locale }: { locale: string }) {
  useEffect(() => {
    // Set the document language
    document.documentElement.lang = locale;

    // Set the document title with locale
    const currentTitle = document.title;
    if (!currentTitle.includes("ZoomPDF")) {
      document.title = `ZoomPDF - ${locale.toUpperCase()}`;
    }
  }, [locale]);

  return null;
}
