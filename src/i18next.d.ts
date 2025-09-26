import 'i18next';

// This is needed to add the backend property to the Services interface.
// The i18next-locize-backend plugin adds this property on runtime.
declare module 'i18next' {
  interface Services {
    backend: {
      getLanguages: (
        callback: (err: Error | null, languages: Record<string, any>) => void
      ) => void;
    };
  }
}