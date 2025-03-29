import React, { Suspense, lazy, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTelegram } from "../context/TelegramContext";
import PageLayout from "../components/PageLayout";
import SectionHeading from "../components/SectionHeading";

// Lazy load the ExerciseList component
const ExerciseList = lazy(() => import("../components/ExerciseList"));

const ExercisePage: React.FC = () => {
  const { t } = useTranslation();
  const { webApp } = useTelegram();

  useEffect(() => {
    if (webApp) {
      // Enable back button in the Telegram UI
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => {
        window.history.back();
      });
    }

    return () => {
      if (webApp) {
        webApp.BackButton.offClick();
      }
    };
  }, [webApp]);

  return (
    <PageLayout>
      <SectionHeading title={t("navigation.exercises")} align="center" />

      <Suspense
        fallback={
          <div className="flex h-60vh items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-tg-button border-r-transparent"></div>
            <p className="ml-4 text-text-secondary">{t("common.loading")}</p>
          </div>
        }
      >
        <ExerciseList />
      </Suspense>
    </PageLayout>
  );
};

export default ExercisePage;
