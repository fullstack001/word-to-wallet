"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "@/i18n/config";

const languageNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  ko: "한국어",
  se: "Svenska",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Split the pathname into segments
    const segments = pathname.split("/").filter(Boolean);

    // Remove the current locale from the beginning if it exists
    if (segments[0] === locale) {
      segments.shift();
    }

    // Construct the new path with the new locale
    const remainingPath = segments.length > 0 ? `/${segments.join("/")}` : "";
    const newPath = `/${newLocale}${remainingPath}`;

    console.log(`Language switch: ${pathname} -> ${newPath}`);
    router.push(newPath);
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {languageNames[loc]}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
