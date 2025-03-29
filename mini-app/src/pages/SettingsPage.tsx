import React from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import AppBottomNavigation from "../components/AppBottomNavigation";
import { useTheme } from "../context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ThemeDisplay from "../components/ThemeDisplay";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { mode, toggleTheme, theme } = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <Container maxWidth="sm" sx={{ py: 3, pb: 7 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("settings.title")}
        </Typography>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t("settings.language")}
          </Typography>
          <LanguageToggle />
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">{t("settings.darkMode")}</Typography>
            <Box display="flex" alignItems="center">
              <LightModeIcon
                color={mode === "light" ? "primary" : "disabled"}
              />
              <Switch
                checked={mode === "dark"}
                onChange={toggleTheme}
                color="primary"
              />
              <DarkModeIcon color={mode === "dark" ? "primary" : "disabled"} />
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 2 }}
          >
            {mode === "light"
              ? t("settings.enableDarkMode")
              : t("settings.enableLightMode")}
          </Typography>
          <ThemeDisplay />
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t("settings.notifications")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <FormControlLabel
            control={<Switch defaultChecked />}
            label={t("profile.workoutReminders")}
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label={t("profile.progressUpdates")}
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label={t("profile.subscriptionAlerts")}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t("settings.units")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <FormControlLabel
            control={<Switch defaultChecked />}
            label={t("settings.metric")}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t("settings.about")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" paragraph>
            {t("settings.version")}: 1.0.0
          </Typography>
          <Typography variant="body2">
            {t("settings.contactSupport")}:
            <Box component="span" sx={{ fontWeight: "bold", ml: 1 }}>
              support@fitnessbot.example.com
            </Box>
          </Typography>
        </Paper>
      </Box>

      <AppBottomNavigation />
    </Container>
  );
};

export default SettingsPage;
