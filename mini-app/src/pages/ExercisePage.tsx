import React, { Suspense, lazy, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
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
    </PageLayout>
  );
};

export default ExercisePage;
