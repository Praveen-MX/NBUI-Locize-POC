# i18next and Locize Integration Guide

This document outlines the setup for integrating `react-i18next` with the Locize translation management service in this project.

## Packages

-   **`react-i18next`**: The main library for binding i18next to React.
-   **`i18next`**: The core internationalization framework.
-   **`i18next-browser-languagedetector`**: A plugin to detect the user's language from the browser.
-   **`i18next-locize-backend`**: A plugin that connects directly to the Locize service, enabling features like fetching translations and automatically adding new keys.
-   **`locize-cli`**: A command-line tool for syncing local translation files with your Locize project.

## Configuration

The i18next instance is configured in a central file, [`src/i18n.ts`](src/i18n.ts). This file controls the loading of plugins, fallback languages, and the connection to the Locize backend.

```typescript
// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import LocizeBackend from 'i18next-locize-backend';

const locizeOptions = {
  projectId: '<your-locize-project-id>',
  apiKey: '<your-locize-api-key>',
  referenceLng: 'en',
};

i18n
  .use(LocizeBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (format === 'longDate' && value instanceof Date) {
          return new Intl.DateTimeFormat(lng, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(value);
        }
        return value;
      },
    },
    backend: locizeOptions,
    saveMissing: true, // Automatically send new keys to Locize
  });

export default i18n;
```

The `saveMissing: true` option is a key feature. When running in development, any translation key used in the app that doesn't exist in Locize will be automatically added to your project.

## Using Translations in Components

### Basic Text with the `t` function

For standard text translation, use the `useTranslation` hook to get the `t` function.

```tsx
// src/Dashboard.tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

// ...
<h1>{t('dashboardTitle')}</h1>
<input
  type="text"
  placeholder={t('searchPlaceholder')}
/>
```

### Translations with HTML using the `Trans` component

For translations that include JSX components like links or bold text, use the `Trans` component.

```tsx
// src/Dashboard.tsx
import { Trans } from 'react-i18next';

<p>
  <Trans i18nKey="footerText">
    To learn more, <a href="https://docs.mendix.com/releasenotes/mobile/mendix-native-mobile-builder/" target="_blank" rel="noopener noreferrer">visit our documentation</a>.
  </Trans>
</p>
```

### Interpolation, Formatting, and Plurals

`i18next` supports advanced features directly in your translation strings.

```tsx
// src/Dashboard.tsx
// Interpolation
<p>{t('welcomeMessage', { content: 'Mendix Native Mobile Builder' })}</p>

// Formatting
<p>{t('todayIs', { date: new Date() })}</p>

// Plurals
<p>{t('itemCount', { count: itemCount })}</p>
```

## Implementing a Language Switcher

The language switcher fetches available languages directly from Locize and allows the user to change the active language.

```tsx
// src/LanguageSwitcher.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
const [languages, setLanguages] = useState({});

useEffect(() => {
  // Fetches languages from the Locize backend
  i18n.services.backendConnector.backend.getLanguages((err, lngs) => {
    if (err) return;
    setLanguages(lngs);
  });
}, [i18n]);

const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
};

return (
  <div className="language-buttons-container">
    {Object.keys(languages).map((lng) => (
      <button
        key={lng}
        onClick={() => changeLanguage(lng)}
      >
        {languages[lng].nativeName}
      </button>
    ))}
  </div>
);
```

## Translation Workflow

### Adding and Translating Keys

1.  **Add a Key**: Use a new key in the `t()` function within your component code.
2.  **Auto-Creation**: Run the app (`npm start`). The `saveMissing: true` configuration will automatically add the new key to your Locize project.
3.  **Translate**: Open your project on the Locize website. The new key will be there, ready for you to add translations for other languages (e.g., Dutch).

### Alternative: File-based Workflow

If you prefer to manage your source language locally, you can use the `locize-cli`.

1.  **Maintain Local File**: Add or update keys in [`public/locales/en/translation.json`](public/locales/en/translation.json).
2.  **Upload to Locize**: Run the following command to sync your local file with your Locize project. This will add new keys and update existing ones.

    ```sh
    npm run locize:upload
    ```

## Translating in the Locize UI

Once your keys are in your Locize project, you can add translations for other languages.

1.  **Navigate to your Project**: Log in to [Locize](https://locize.com) and open your project.
2.  **Select a Language**: In the left sidebar, you will see your list of languages. The reference language (e.g., `en`) will have all the keys. Select the language you want to translate into (e.g., `nl` for Dutch).
3.  **Find Untranslated Keys**: Use the filter at the top of the page to show only **Untranslated** keys. This will give you a clear list of what needs to be done.

### Manual Translation

For each key, you will see the source text from your reference language. Simply type the corresponding translation into the input box for the target language. Your changes are saved automatically as you type.

### Using Machine Translation

Locize provides machine translation suggestions(Batch machine translations are not available in trial account).

1.  **Enable Machine Translation**: In your project's settings on the Locize website, go to the "Machine Translation" section and enable a service (e.g., Google Translate, DeepL).
2.  **Get Suggestions**: Once enabled, when you click on an empty translation field, a suggestion from the machine translation service will appear. You can click it to accept.
3.  **Batch Translate**: To translate multiple keys at once, select them using the checkboxes. A toolbar will appear at the bottom. Click the "Machine Translate" button to fill in all selected empty fields with machine translations. You can then review and adjust them as needed.