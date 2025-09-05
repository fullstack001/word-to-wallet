import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { locales, defaultLocale } from "@/i18n/config";

export function useLocalizedNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const nextIntlLocale = useLocale();

  // Extract locale from pathname directly
  const getLocaleFromPath = (path: string): string => {
    const segments = path.split("/").filter(Boolean);
    const firstSegment = segments[0];

    // Check if the first segment is a valid locale
    if (firstSegment && locales.includes(firstSegment as any)) {
      return firstSegment;
    }

    // Fall back to next-intl locale or default locale
    return nextIntlLocale || defaultLocale;
  };

  const locale = getLocaleFromPath(pathname);

  const navigate = (path: string) => {
    // Always add locale prefix since we're using "always" prefix
    router.push(`/${locale}${path}`);
  };

  const getLocalizedPath = (path: string, targetLocale?: string) => {
    const target = targetLocale || locale;
    return `/${target}${path}`;
  };

  const switchLocale = (newLocale: string) => {
    if (!locales.includes(newLocale as any)) {
      console.warn(`Invalid locale: ${newLocale}`);
      return;
    }

    // Split the pathname into segments
    const segments = pathname.split("/").filter(Boolean);

    // Remove the current locale from the beginning if it exists
    if (segments[0] === locale) {
      segments.shift();
    }

    // Construct the new path with the new locale
    const remainingPath = segments.length > 0 ? `/${segments.join("/")}` : "";
    const newPath = `/${newLocale}${remainingPath}`;

    console.log(
      `Switching locale from ${locale} to ${newLocale}: ${pathname} -> ${newPath}`
    );
    router.push(newPath);
  };

  return {
    navigate,
    getLocalizedPath,
    switchLocale,
    currentLocale: locale,
    pathname,
  };
}
