import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../translations/en";
import skTranslation from "../translations/sk";

i18next.use(initReactI18next);

i18next.init({
  resources: {
    en: {
      ui: enTranslation,
    },
    sk: {
      ui: skTranslation,
    },
  },
  fallbackLng: "sk",
  interpolation: {
    escapeValue: false,
  },
});

export const i18n = i18next;
