"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
  shouldShowGoogleTranslate,
  getGoogleTranslateCode,
  getUserPreferredLanguage,
} from "@/utils/languageConfig";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

interface GoogleTranslateWidgetProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export default function GoogleTranslateWidget({
  className = "",
  position = "top-right",
}: GoogleTranslateWidgetProps) {
  const locale = useLocale();
  const [shouldShow, setShouldShow] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Translate should be shown
    const showTranslate = shouldShowGoogleTranslate(locale);
    setShouldShow(showTranslate);

    if (!showTranslate) return;

    // Load Google Translate script if not already loaded
    if (!window.google?.translate) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);

      // Initialize Google Translate
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "auto",
            includedLanguages:
              "en,es,fr,ko,sv,zh,cs,nl,de,el,hu,id,it,ja,ms,pl,pt,ro,sr,th,tr,uk,vi,fi",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true,
          },
          "google_translate_element"
        );
        setIsLoaded(true);
      };
    } else {
      setIsLoaded(true);
    }

    return () => {
      // Cleanup function
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit = undefined as any;
      }
    };
  }, [locale]);

  // Don't render if Google Translate shouldn't be shown
  if (!shouldShow) {
    return null;
  }

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()} ${className}`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex items-center space-x-2 mb-2">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Translate this page
          </span>
        </div>
        <div id="google_translate_element" className="min-h-[40px]">
          {!isLoaded && (
            <div className="flex items-center justify-center h-10">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Alternative minimal version that shows just the Google Translate dropdown
export function MinimalGoogleTranslateWidget({
  className = "",
}: {
  className?: string;
}) {
  const locale = useLocale();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const showTranslate = shouldShowGoogleTranslate(locale);
    setShouldShow(showTranslate);

    if (!showTranslate) return;

    // Load Google Translate script
    if (!window.google?.translate) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "auto",
            includedLanguages:
              "en,es,fr,ko,sv,zh,cs,nl,de,el,hu,id,it,ja,ms,pl,pt,ro,sr,th,tr,uk,vi,fi",
            layout:
              window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            autoDisplay: false,
          },
          "minimal_google_translate_element"
        );
      };
    }

    return () => {
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit = undefined as any;
      }
    };
  }, [locale]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div id="minimal_google_translate_element"></div>
    </div>
  );
}
