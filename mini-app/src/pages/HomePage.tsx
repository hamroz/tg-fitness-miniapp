import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTelegram } from "../context/TelegramContext";

const HomePage = () => {
  const { user, webApp } = useTelegram();
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);

  useEffect(() => {
    // In a real app, check if user has phone number
    // For now, we'll just simulate it
    if (user) {
      // This would be an API call in a real app
      setHasPhoneNumber(false);
    }
  }, [user]);

  useEffect(() => {
    if (webApp) {
      // Show back button if coming from Telegram
      webApp.BackButton.hide();
    }
  }, [webApp]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: 3,
          textAlign: "center",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Fitness Trainer
        </Typography>
        <Typography variant="subtitle1">
          {user
            ? `Welcome, ${user.firstName}!`
            : "Welcome to your personal fitness assistant!"}
        </Typography>
      </Paper>

      <Stack spacing={3}>
        {!hasPhoneNumber && (
          <Paper
            sx={{
              p: 3,
              backgroundColor: "primary.light",
              color: "primary.contrastText",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Complete Your Profile
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Please add your phone number to continue.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/profile"
              fullWidth
            >
              Add Phone Number
            </Button>
          </Paper>
        )}

        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Exercise Library
            </Typography>
            <Typography variant="body2" gutterBottom>
              Browse our collection of exercises for all fitness levels.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/exercises"
              fullWidth
              sx={{ mt: 1 }}
            >
              View Exercises
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Track Progress
            </Typography>
            <Typography variant="body2" gutterBottom>
              View your workout history and progress.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/progress"
              fullWidth
              sx={{ mt: 1 }}
            >
              View Progress
            </Button>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default HomePage;
