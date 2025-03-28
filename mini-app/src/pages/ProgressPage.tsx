import { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import WorkoutCalendar from "../components/WorkoutCalendar";
import { useTelegram } from "../context/TelegramContext";

const ProgressPage = () => {
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
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Progress
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your workout history and see your progress over time.
        </Typography>
      </Box>

      <WorkoutCalendar />
    </Container>
  );
};

export default ProgressPage;
