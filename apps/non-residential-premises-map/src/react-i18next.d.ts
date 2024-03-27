import "i18next";
import enTranslation from "./translations/en";
import mapsEnTranslation from "./libs/react-maps/src/translations/en";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof enTranslation;
      maps: typeof mapsEnTranslation;
    };
  }
}
