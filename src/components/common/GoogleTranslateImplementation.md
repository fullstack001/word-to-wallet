# Google Translate Integration with Conditional Visibility

This implementation provides a smart Google Translate integration that only shows when the user's preferred language is not supported by your i18n system.

## Features

- **Conditional Visibility**: Only shows Google Translate when user's preferred language is not in your supported locales
- **Centralized Configuration**: Define your supported languages in one place (`src/i18n/config.ts`)
- **Browser Language Detection**: Automatically detects user's preferred language from browser settings
- **Multiple Widget Options**: Choose between floating widget, minimal dropdown, or integrated components
- **TypeScript Support**: Fully typed for better development experience

## How It Works

1. **Language Detection**: Detects user's preferred language from `navigator.languages` or `navigator.language`
2. **Support Check**: Compares user's language against your supported i18n locales
3. **Conditional Display**: Shows Google Translate only if user's language is not supported
4. **Fallback Translation**: Provides Google Translate as a fallback for unsupported languages

## Configuration

### 1. Define Supported Languages

In `src/i18n/config.ts`:

```typescript
export const locales = ["en", "es", "fr", "ko", "se"] as const;

// Google Translate language codes mapping
export const googleTranslateCodes: Record<Locale, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  ko: "ko",
  se: "sv", // Swedish in Google Translate
} as const;
```

### 2. Add New Languages

To add support for a new language:

1. Add the locale to `locales` array
2. Add the Google Translate code mapping
3. Create translation files in `messages/` directory
4. Update the `localeNames` mapping

## Usage Examples

### 1. Floating Widget (Default)

The widget automatically appears in the top-right corner when needed:

```tsx
import GoogleTranslateWidget from "@/components/common/GoogleTranslateWidget";

// In your layout
<GoogleTranslateWidget />;
```

### 2. Minimal Dropdown

For a cleaner, integrated look:

```tsx
import { MinimalGoogleTranslateWidget } from "@/components/common/GoogleTranslateWidget";

<MinimalGoogleTranslateWidget />;
```

### 3. Conditional Component with Fallback Text

Shows helpful text explaining why Google Translate is available:

```tsx
import { ConditionalGoogleTranslate } from "@/components/common";

<ConditionalGoogleTranslate
  showAsFallback={true}
  fallbackText="Your language is not yet supported. Use the translator below:"
/>;
```

### 4. Simple Indicator

Just shows a small indicator when translation is available:

```tsx
import { GoogleTranslateIndicator } from "@/components/common";

<GoogleTranslateIndicator />;
```

### 5. Using the Hook

For custom implementations:

```tsx
import { useLanguageDetection } from "@/hooks/useLanguageDetection";

function MyComponent() {
  const {
    showGoogleTranslate,
    userPreferredLanguage,
    isUserLanguageSupported,
  } = useLanguageDetection();

  if (!showGoogleTranslate) {
    return <div>Your language is fully supported!</div>;
  }

  return <div>Google Translate available for {userPreferredLanguage}</div>;
}
```

## Integration Points

### Layout Integration

The widget is already integrated in `src/app/[locale]/layout.tsx`:

```tsx
<GoogleTranslateWidget />
```

### Footer Integration

Example integration in footer (already implemented):

```tsx
<ConditionalGoogleTranslate className="text-center" />
```

### Navbar Integration

You can add it to your navbar:

```tsx
import { GoogleTranslateIndicator } from "@/components/common";

// In your navbar
<div className="flex items-center space-x-4">
  <LanguageSwitcher />
  <GoogleTranslateIndicator />
</div>;
```

## Customization

### Widget Position

```tsx
<GoogleTranslateWidget position="bottom-left" />
```

Available positions: `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`

### Styling

The components use Tailwind CSS classes and can be customized:

```tsx
<GoogleTranslateWidget className="custom-styles" />
<ConditionalGoogleTranslate className="bg-gray-100 p-4 rounded" />
```

## Language Detection Logic

The system follows this priority:

1. **Primary**: Check `navigator.languages` array (most accurate)
2. **Fallback**: Check `navigator.language`
3. **Default**: Use "en" if no match found

For each detected language:

1. Extract language code (e.g., "en-US" → "en")
2. Check if it's in your supported locales
3. Show Google Translate if not supported

## Browser Support

- **Modern Browsers**: Full support with `navigator.languages`
- **Older Browsers**: Falls back to `navigator.language`
- **Server-Side**: Gracefully handles SSR with default values

## Performance Considerations

- **Lazy Loading**: Google Translate script loads only when needed
- **Conditional Rendering**: Components don't render if not needed
- **Minimal Bundle Impact**: Only loads when user's language is unsupported

## Testing

To test the implementation:

1. **Change Browser Language**:
   - Chrome: Settings → Languages → Add languages
   - Firefox: Settings → General → Language
2. **Test Scenarios**:

   - User with supported language (en, es, fr, ko, se) → No Google Translate
   - User with unsupported language (de, zh, etc.) → Google Translate appears

3. **Manual Testing**:
   ```javascript
   // In browser console
   console.log(navigator.languages);
   console.log(navigator.language);
   ```

## Troubleshooting

### Google Translate Not Appearing

1. Check if user's language is in your supported locales
2. Verify browser language settings
3. Check console for JavaScript errors
4. Ensure Google Translate script loads properly

### Language Detection Issues

1. Verify `navigator.languages` is available
2. Check language code format (should be 2-letter codes)
3. Ensure your locale configuration is correct

### Styling Issues

1. Check Tailwind CSS classes
2. Verify z-index for floating widgets
3. Test responsive behavior on different screen sizes

## Future Enhancements

- **User Preference Storage**: Remember user's translation preference
- **Custom Translation API**: Replace Google Translate with custom service
- **Language Request System**: Allow users to request new language support
- **Analytics Integration**: Track translation usage
- **A/B Testing**: Test different widget positions and styles
