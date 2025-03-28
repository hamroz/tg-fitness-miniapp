import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: "ru", // Russian is default
    interpolation: {
      escapeValue: false, // not needed for React
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
    },
    detection: {
      order: ["querystring", "navigator", "localStorage"],
      lookupQuerystring: "lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
