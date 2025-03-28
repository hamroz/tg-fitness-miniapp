import { useEffect } from "react";
import { Container, Typography, Box, Paper, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhoneInput from "../components/PhoneInput";
import { useTelegram } from "../context/TelegramContext";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import AppBottomNavigation from "../components/AppBottomNavigation";

const ProfilePage = () => {
  const { webApp } = useTelegram();
  const navigate = useNavigate();
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

  const handlePhoneNumberSubmit = (phoneNumber: string) => {
    // In a real app, we would save this to the database
    console.log("Phone number submitted:", phoneNumber);

    // Redirect to home page after successful submission
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 7 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("profile.personalInfo")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("profile.phone")}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <PhoneInput onSubmit={handlePhoneNumberSubmit} />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t("profile.preferredLanguage")}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <LanguageToggle />
      </Paper>

      <AppBottomNavigation />
    </Container>
  );
};

export default ProfilePage;
