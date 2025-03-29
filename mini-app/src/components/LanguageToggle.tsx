import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Language toggle component to switch between English and Russian
 */
const LanguageToggle: React.FC = () => {
  const { i18n, t } = useTranslation();

  // Ensure language is stored in localStorage on component mount
  useEffect(() => {
    const currentLanguage = i18n.language || "ru";
    localStorage.setItem("i18nextLng", currentLanguage);
  }, [i18n.language]);

  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage) {
      i18n.changeLanguage(newLanguage);
      // Explicitly save to localStorage
      localStorage.setItem("i18nextLng", newLanguage);
    }
  };

  return (
    <div className="flex flex-col items-center my-4">
      <h3 className="mb-2 text-base font-medium">{t("common.language")}</h3>
      <div className="inline-flex rounded-md shadow-sm">
        <button
          type="button"
          className={`py-2 px-4 text-sm font-medium rounded-l-lg border border-r-0 focus:z-10 focus:outline-none transition-all duration-200 ${
            i18n.language === "ru"
              ? "bg-tg-button text-white border-tg-button"
              : "bg-paper text-text-secondary border-border hover:bg-tg-button/10"
          }`}
          onClick={() => handleLanguageChange("ru")}
        >
          🇷🇺 Русский
        </button>
        <button
          type="button"
          className={`py-2 px-4 text-sm font-medium rounded-r-lg border focus:z-10 focus:outline-none transition-all duration-200 ${
            i18n.language === "en"
              ? "bg-tg-button text-white border-tg-button"
              : "bg-paper text-text-secondary border-border hover:bg-tg-button/10"
          }`}
          onClick={() => handleLanguageChange("en")}
        >
          🇬🇧 English
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
