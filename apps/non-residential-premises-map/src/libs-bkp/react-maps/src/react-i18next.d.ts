import 'i18next';
import enTranslation from './translations/en';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      maps: typeof enTranslation;
    };
  }
}
