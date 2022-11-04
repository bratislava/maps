import "react-i18next";
import enTranslation from "./translations/en";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof enTranslation;
    };
  }
}
