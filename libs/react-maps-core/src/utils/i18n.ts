import { i18n as i18next } from "@bratislava/react-maps-ui";
import enTranslation from "../translations/en";
import skTranslation from "../translations/sk";

i18next.addResourceBundle("en", "map", enTranslation);
i18next.addResourceBundle("sk", "map", skTranslation);

export const i18n = i18next;
