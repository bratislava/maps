import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../translations/en";
import skTranslation from "../translations/sk";

import { i18n as ReactMapsI18n } from "@bratislava/react-maps";

const getLangFromQuery = () => {
  const pathnameArray = window.location.pathname.split("/");
  const langUrl = pathnameArray[pathnameArray.length - 1].split(".html")[0];
  const langQuery = new URLSearchParams(window.location.search).get("lang");
  if (langUrl === "sk" || langUrl === "en") {
    return langUrl;
  } else if (langQuery === "sk" || langQuery === "en") {
    return langQuery;
  }
  return "sk";
};

const queryLanguage = getLangFromQuery();

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: import.meta.env.DEV,
    resources: {
      en: {
        translation: enTranslation,
      },
      sk: {
        translation: skTranslation,
      },
    },
    // missingKeyHandler(lngs, ns, key) {
    //   if (import.meta.env.DEV) {
    //     console.warn(
    //       `Missing translation for '${lngs}' language in namespace '${ns}' => key: '${key}'`,
    //     );
    //   }
    // },
    lng: queryLanguage,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

ReactMapsI18n.changeLanguage(queryLanguage);

i18n.on("languageChanged", (lng) => {
  ReactMapsI18n.changeLanguage(lng);
});

export default i18n;
