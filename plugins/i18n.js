import i18n from 'i18next';

i18n.init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'pl'],
  resources: {
    en: {
      translation: {
        Close: 'Close',
        ContentTypes: 'Content types',
        Settings: 'Settings',
      },
    },
    pl: {
      translation: {
        Close: 'Zamknij',
        ContentTypes: 'Definicje typu',
        Settings: 'Ustawienia',
      },
    },
  },
});

export default i18n;
