# Internationalization (i18n) Setup

This project uses `next-intl` for internationalization support.

## Configuration Files

### `config.ts`

Defines supported locales and default locale:

- **Supported locales**: `en`, `es`, `fr`, `ko`, `se`
- **Default locale**: `en`

### `request.ts`

Handles message loading for each locale. Validates incoming locale parameters and loads the appropriate translation file.

### `types.ts`

TypeScript interfaces for type-safe translations and configuration.

### `utils.ts`

Utility functions for locale detection and pathname manipulation.

## Translation Files

Translation files are located in the `messages/` directory:

- `en.json` - English
- `es.json` - Spanish
- `fr.json` - French
- `ko.json` - Korean
- `se.json` - Swedish

## Usage

### In Components

```tsx
import { useTranslations, useLocale } from "next-intl";

export default function MyComponent() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div>
      <h1>{t("navigation.home")}</h1>
      <p>Current locale: {locale}</p>
    </div>
  );
}
```

### Using the Custom Hook

```tsx
import { useI18n } from "@/hooks/useI18n";

export default function MyComponent() {
  const { t, locale, isCurrentLocale } = useI18n();

  return (
    <div>
      <h1>{t("navigation.home")}</h1>
      {isCurrentLocale("en") && <p>English content</p>}
    </div>
  );
}
```

### Language Switcher

Use the `LanguageSwitcher` component to allow users to change languages:

```tsx
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## Adding New Translations

1. Add the translation key to all language files in `messages/`
2. Update the `TranslationMessages` interface in `types.ts`
3. Use the translation key in your components

## Middleware

The `middleware.ts` file handles locale detection and routing. It automatically:

- Detects the user's preferred locale
- Redirects to the appropriate localized route
- Maintains locale prefixes in URLs

## URL Structure

URLs follow the pattern: `/{locale}/{path}`

- `/en/convert` - English conversion page
- `/es/convert` - Spanish conversion page
- `/fr/convert` - French conversion page
- etc.
