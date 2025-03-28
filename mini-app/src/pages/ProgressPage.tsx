import { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import WorkoutCalendar from "../components/WorkoutCalendar";
import { useTelegram } from "../context/TelegramContext";
import { useTranslation } from "react-i18next";
import AppBottomNavigation from "../components/AppBottomNavigation";

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
    <Container maxWidth="md" sx={{ py: 3, pb: 7 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("navigation.progress")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("home.recentWorkouts")}
        </Typography>
      </Box>

      <WorkoutCalendar />

      <AppBottomNavigation />
    </Container>
  );
};

export default ProgressPage;
