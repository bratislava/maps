import { use as i18nextUse } from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "../translations/en";
import skTranslation from "../translations/sk";

const i18next = i18nextUse(initReactI18next);

export const getLangFromQuery = () => {
  const langQuery = new URLSearchParams(window.location.search).get("lang");
  if (langQuery === "sk" || langQuery === "en") {
    return langQuery;
  } else {
    return "en";
  }
};

i18next.init({
  resources: {
    en: { translation: enTranslation },
    sk: { translation: skTranslation },
  },
  lng: getLangFromQuery(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
