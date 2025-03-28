import React, { Suspense, lazy, useEffect } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import AppBottomNavigation from "../components/AppBottomNavigation";
import { useTelegram } from "../context/TelegramContext";

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
    <Container maxWidth="md" sx={{ py: 3, pb: 7 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("navigation.exercises")}
        </Typography>
      </Box>

      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              {t("common.loading")}
            </Typography>
          </Box>
        }
      >
        <ExerciseList />
      </Suspense>

      <AppBottomNavigation />
    </Container>
  );
};

export default ExercisePage;
