import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";

// Get the stored language from localStorage or use Russian as default
const storedLanguage = localStorage.getItem("i18nextLng") || "ru";

// Function to clear any cached translations
const clearTranslationCache = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("i18next_res_")) {
      localStorage.removeItem(key);
    }
  });
};

// Clear cache on init
clearTranslationCache();

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
    react: {
      useSuspense: true,
      bindI18n: "languageChanged loaded",
      bindI18nStore: "added removed",
      nsMode: "default",
    },
  });

// Add a listener to ensure complete re-render on language change
i18n.on("languageChanged", () => {
  // Clear cache to ensure fresh translations
  clearTranslationCache();

  // Force reload all translations
  i18n.reloadResources().then(() => {
    // Reset the detected language to ensure it's fully applied
    const currentLang = i18n.language;
    localStorage.setItem("i18nextLng", currentLang);

    // Log language change in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Language changed to: ${currentLang}`);
    }
  });
});

export default i18n;
