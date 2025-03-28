import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTelegram } from "../context/TelegramContext";
import { userApi } from "../services/api";
import { useTranslation } from "react-i18next";
import AppBottomNavigation from "../components/AppBottomNavigation";

const HomePage = () => {
  const { user, webApp } = useTelegram();
  const { t } = useTranslation();
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [userSubscription, setUserSubscription] = useState("free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch user data and check for phone number and subscription
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (webApp) {
      // Show back button if coming from Telegram
      webApp.BackButton.hide();
    }
  }, [webApp]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      if (user?.id) {
        const userData = await userApi.getUserData(user.id.toString());

        // Check if user has phone number
        setHasPhoneNumber(!!userData?.phone);

        // Check subscription type
        if (userData?.subscription) {
          setUserSubscription(userData.subscription);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get subscription display name and color
  const getSubscriptionInfo = () => {
    switch (userSubscription) {
      case "premium":
        return { name: t("subscription.premiumPlan"), color: "primary" };
      case "individual":
        return { name: t("subscription.individualPlan"), color: "secondary" };
      default:
        return { name: t("subscription.freePlan"), color: "default" };
    }
  };

  const subscriptionInfo = getSubscriptionInfo();

  return (
    <Container maxWidth="sm" sx={{ py: 4, pb: 7 }}>
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
          position: "relative",
        }}
      >
        {!isLoading && (
          <Chip
            label={`${subscriptionInfo.name} ${t("subscription.currentPlan")}`}
            color={subscriptionInfo.color as any}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
          />
        )}
        <Typography variant="h4" component="h1" gutterBottom>
          Fitness Trainer
        </Typography>
        <Typography variant="subtitle1">
          {user
            ? `${t("home.welcome")}, ${user.firstName}!`
            : t("home.welcome")}
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
              {t("profile.personalInfo")}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t("profile.phone")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/profile"
              fullWidth
            >
              {t("profile.personalInfo")}
            </Button>
          </Paper>
        )}

        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t("navigation.exercises")}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {t("exercises.searchPlaceholder")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/exercises"
              fullWidth
              sx={{ mt: 1 }}
            >
              {t("navigation.exercises")}
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t("navigation.progress")}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {t("home.recentWorkouts")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/progress"
              fullWidth
              sx={{ mt: 1 }}
            >
              {t("navigation.progress")}
            </Button>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 3,
            backgroundColor:
              userSubscription === "free"
                ? "secondary.light"
                : "background.paper",
            color:
              userSubscription === "free"
                ? "secondary.contrastText"
                : "text.primary",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {userSubscription === "free"
                ? t("subscription.upgradeNow")
                : t("subscription.yourPlan")}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {userSubscription === "free"
                ? t("subscription.premiumFeatures")
                : `${t("subscription.currentPlan")}: ${subscriptionInfo.name}`}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/subscription"
              fullWidth
              sx={{ mt: 1 }}
            >
              {userSubscription === "free"
                ? t("subscription.choosePlan")
                : t("subscription.changePlan")}
            </Button>
          </Box>
        </Paper>
      </Stack>

      <AppBottomNavigation />
    </Container>
  );
};

export default HomePage;
