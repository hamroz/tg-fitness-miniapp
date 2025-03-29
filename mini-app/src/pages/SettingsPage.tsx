import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import { useTheme } from "../context/ThemeContext";
import ThemeDisplay from "../components/ThemeDisplay";
import PageLayout from "../components/PageLayout";
import SectionHeading from "../components/SectionHeading";
import ContentCard from "../components/ContentCard";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    progressUpdates: true,
    subscriptionAlerts: true,
  });
  const [useMetric, setUseMetric] = useState(true);

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <PageLayout>
      <SectionHeading title={t("settings.title")} align="center" />

      <ContentCard title={t("settings.language")}>
        <LanguageToggle />
      </ContentCard>

      <ContentCard title={t("settings.darkMode")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                mode === "light" ? "text-tg-button" : "text-gray-400"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>

            <div className="relative mx-3 inline-block h-6 w-12">
              <input
                type="checkbox"
                className="peer h-6 w-12 cursor-pointer appearance-none rounded-full bg-gray-200 transition-colors duration-300 checked:bg-tg-button"
                checked={mode === "dark"}
                onChange={toggleTheme}
              />
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 peer-checked:left-7"></span>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                mode === "dark" ? "text-tg-button" : "text-gray-400"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>
        </div>

        <p className="mt-2 mb-4 text-sm text-text-secondary">
          {mode === "light"
            ? t("settings.enableDarkMode")
            : t("settings.enableLightMode")}
        </p>

        <ThemeDisplay />
      </ContentCard>

      <ContentCard title={t("settings.notifications")} divider>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-between">
            <span>{t("profile.workoutReminders")}</span>
            <div className="relative inline-block h-6 w-12">
              <input
                type="checkbox"
                className="peer h-6 w-12 cursor-pointer appearance-none rounded-full bg-gray-200 transition-colors duration-300 checked:bg-tg-button"
                checked={notifications.workoutReminders}
                onChange={() => handleNotificationChange("workoutReminders")}
              />
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 peer-checked:left-7"></span>
            </div>
          </label>

          <label className="flex cursor-pointer items-center justify-between">
            <span>{t("profile.progressUpdates")}</span>
            <div className="relative inline-block h-6 w-12">
              <input
                type="checkbox"
                className="peer h-6 w-12 cursor-pointer appearance-none rounded-full bg-gray-200 transition-colors duration-300 checked:bg-tg-button"
                checked={notifications.progressUpdates}
                onChange={() => handleNotificationChange("progressUpdates")}
              />
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 peer-checked:left-7"></span>
            </div>
          </label>

          <label className="flex cursor-pointer items-center justify-between">
            <span>{t("profile.subscriptionAlerts")}</span>
            <div className="relative inline-block h-6 w-12">
              <input
                type="checkbox"
                className="peer h-6 w-12 cursor-pointer appearance-none rounded-full bg-gray-200 transition-colors duration-300 checked:bg-tg-button"
                checked={notifications.subscriptionAlerts}
                onChange={() => handleNotificationChange("subscriptionAlerts")}
              />
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 peer-checked:left-7"></span>
            </div>
          </label>
        </div>
      </ContentCard>

      <ContentCard title={t("settings.units")} divider>
        <label className="flex cursor-pointer items-center justify-between">
          <span>{t("settings.metric")}</span>
          <div className="relative inline-block h-6 w-12">
            <input
              type="checkbox"
              className="peer h-6 w-12 cursor-pointer appearance-none rounded-full bg-gray-200 transition-colors duration-300 checked:bg-tg-button"
              checked={useMetric}
              onChange={() => setUseMetric(!useMetric)}
            />
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 peer-checked:left-7"></span>
          </div>
        </label>
      </ContentCard>

      <ContentCard title={t("settings.about")} divider>
        <p className="mb-3 text-sm">{t("settings.version")}: 1.0.0</p>
        <p className="text-sm">
          {t("settings.contactSupport")}:
          <span className="ml-1 font-bold">support@fitnessbot.example.com</span>
        </p>
      </ContentCard>
    </PageLayout>
  );
};

export default SettingsPage;
