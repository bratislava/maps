import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../translations/en";
import skTranslation from "../translations/sk";

const getLangFromQuery = () => {
  const langQuery = new URLSearchParams(window.location.search).get("lang");
  if (langQuery === "sk" || langQuery === "en") {
    return langQuery;
  } else {
    return "sk";
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      sk: {
        translation: skTranslation,
      },
    },
    lng: getLangFromQuery(),
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
