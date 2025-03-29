import { useEffect } from "react";
import WorkoutCalendar from "../components/WorkoutCalendar";
import { useTelegram } from "../context/TelegramContext";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";
import SectionHeading from "../components/SectionHeading";

const ProgressPage = () => {
  const { webApp } = useTelegram();
  const { t } = useTranslation();

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
      <SectionHeading
        title={t("navigation.progress")}
        // subtitle={t("home.recentWorkouts")}
        align="center"
      />

      <WorkoutCalendar />
    </PageLayout>
  );
};

export default ProgressPage;
