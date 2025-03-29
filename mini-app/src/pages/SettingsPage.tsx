import React from "react";
import {
  Box,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import { useTheme } from "../context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ThemeDisplay from "../components/ThemeDisplay";
import PageLayout from "../components/PageLayout";
import SectionHeading from "../components/SectionHeading";
import ContentCard from "../components/ContentCard";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { mode, toggleTheme, theme } = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <PageLayout>
      <SectionHeading title={t("settings.title")} align="center" />

      <ContentCard title={t("settings.language")}>
        <LanguageToggle />
      </ContentCard>

      <ContentCard title={t("settings.darkMode")}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <LightModeIcon color={mode === "light" ? "primary" : "disabled"} />
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
      </ContentCard>

      <ContentCard title={t("settings.notifications")} divider>
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
      </ContentCard>

      <ContentCard title={t("settings.units")} divider>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label={t("settings.metric")}
        />
      </ContentCard>

      <ContentCard title={t("settings.about")} divider>
        <Typography variant="body2" paragraph>
          {t("settings.version")}: 1.0.0
        </Typography>
        <Typography variant="body2">
          {t("settings.contactSupport")}:
          <Box component="span" sx={{ fontWeight: "bold", ml: 1 }}>
            support@fitnessbot.example.com
          </Box>
        </Typography>
      </ContentCard>
    </PageLayout>
  );
};

export default SettingsPage;
