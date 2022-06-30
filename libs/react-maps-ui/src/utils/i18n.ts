import { i18n } from "i18next";
import enTranslation from "../translations/en";
import skTranslation from "../translations/sk";

export const addTranslations = (i18next: i18n) => {
  i18next.addResourceBundle("en", "ui", enTranslation);
  i18next.addResourceBundle("sk", "ui", skTranslation);
};
