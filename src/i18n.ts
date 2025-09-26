import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import LocizeBackend from 'i18next-locize-backend';

const locizeOptions = {
  projectId: '<locize-project-id>',
  apiKey: '<locize-api-key>', // In a real app, use a private key for saveMissing functionality
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