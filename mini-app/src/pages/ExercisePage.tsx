import { useEffect } from "react";
import { Container } from "@mui/material";
import ExerciseList from "../components/ExerciseList";
import { useTelegram } from "../context/TelegramContext";

const ExercisePage = () => {
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
    <Container maxWidth="md" sx={{ py: 2 }}>
      <ExerciseList />
    </Container>
  );
};

export default ExercisePage;
