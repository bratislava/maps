import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../translations/en';
import skTranslation from '../translations/sk';

const i18n = createInstance({
  resources: {
    en: {
      maps: enTranslation,
    },
    sk: {
      maps: skTranslation,
    },
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

i18n.use(initReactI18next).init();

export default i18n;
