import React from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import AppBottomNavigation from "../components/AppBottomNavigation";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ pb: 7 }}>
      <Box sx={{ my: 4 }}>
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
