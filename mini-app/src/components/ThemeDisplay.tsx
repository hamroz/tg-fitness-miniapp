import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const ThemeDisplay: React.FC = () => {
  const { mode } = useTheme();
  const { t, i18n } = useTranslation();

  const isDark = mode === "dark";

  return (
    <div
      className={`p-4 rounded-2xl relative overflow-hidden transition-all duration-300 ease-in-out h-32 w-full 
      ${
        isDark
          ? "bg-gradient-to-br from-[#1e1e1e] to-[#2d2d2d] text-white border border-white/10"
          : "bg-gradient-to-br from-[#f5f7fa] to-[#e4e8f0] text-gray-800 border border-black/5"
      }`}
    >
      <div className="absolute right-4 top-4 transition-all duration-300 ease-in-out">
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-accent"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <div className="flex flex-col h-full justify-center">
        <h2 className="text-lg font-bold" key={`mode-title-${i18n.language}`}>
          {isDark ? t("settings.darkMode") : t("settings.lightMode")}
        </h2>
        <p
          className="text-sm mt-1 opacity-80"
          key={`mode-desc-${i18n.language}`}
        >
          {isDark
            ? t("settings.optimizedForNightViewing")
            : t("settings.optimizedForDayViewing")}
        </p>
      </div>
    </div>
  );
};

export default ThemeDisplay;
