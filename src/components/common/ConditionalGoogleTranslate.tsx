"use client";

import { useLanguageDetection } from "@/hooks/useLanguageDetection";
import { MinimalGoogleTranslateWidget } from "./GoogleTranslateWidget";

interface ConditionalGoogleTranslateProps {
  className?: string;
  showAsFallback?: boolean;
  fallbackText?: string;
}

/**
 * A component that conditionally shows Google Translate only when needed
 * Can be used in footer, navbar, or any other location
 */
export default function ConditionalGoogleTranslate({
  className = "",
  showAsFallback = true,
  fallbackText = "Translate this page",
}: ConditionalGoogleTranslateProps) {
  const { showGoogleTranslate, userLanguageName, isUserLanguageSupported } =
    useLanguageDetection();

  // Don't show anything if Google Translate shouldn't be displayed
  if (!showGoogleTranslate) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {showAsFallback && (
        <div className="mb-2 text-sm text-gray-600">
          <p>
            Your preferred language ({userLanguageName}) is not yet supported.
            Use the translator below as a fallback:
          </p>
        </div>
      )}
      <MinimalGoogleTranslateWidget />
    </div>
  );
}

/**
 * A simple indicator that shows when Google Translate is available
 * Useful for showing a small badge or indicator
 */
export function GoogleTranslateIndicator({
  className = "",
}: {
  className?: string;
}) {
  const { showGoogleTranslate, userLanguageName } = useLanguageDetection();

  if (!showGoogleTranslate) {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center space-x-1 text-xs text-gray-500 ${className}`}
    >
      <svg
        className="w-3 h-3"
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
      <span>Translate available</span>
    </div>
  );
}
