import { i18n as i18next } from "@bratislava/react-maps";
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

i18next.addResourceBundle("en", "translation", enTranslation);
i18next.addResourceBundle("sk", "translation", skTranslation);
i18next.changeLanguage(getLangFromQuery());

export const i18n = i18next;
