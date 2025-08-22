import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationEN from "../locales/en/translation.json";
import translationTR from "../locales/tr/translation.json";
import translationRU from "../locales/ru/translation.json";
import translationAZ from "../locales/az/translation.json";

// the translations
const resources = {
  en: { translation: translationEN },
  tr: { translation: translationTR },
  ru: { translation: translationRU },
  az: { translation: translationAZ },
};

i18n
  .use(detector) // dil tespiti
  .use(initReactI18next) // react-i18next entegrasyonu
  .init({
    resources,
    fallbackLng: "tr",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
