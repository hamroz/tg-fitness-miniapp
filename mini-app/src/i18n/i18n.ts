import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";

// Get the stored language from localStorage or use Russian as default
const storedLanguage = localStorage.getItem("i18nextLng") || "ru";

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: "ru", // Russian is default
    lng: storedLanguage, // Force the stored language or default to Russian
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
      order: ["localStorage", "querystring", "navigator"],
      lookupQuerystring: "lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
