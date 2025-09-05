import { locales } from "./config";

export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  const locale = segments[1];

  if (locales.includes(locale as any)) {
    return locale;
  }

  return "en";
}

export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  const locale = segments[1];

  if (locales.includes(locale as any)) {
    return "/" + segments.slice(2).join("/");
  }

  return pathname;
}
