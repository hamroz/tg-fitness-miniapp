import React, { useEffect } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Language toggle component to switch between English and Russian
 */
const LanguageToggle: React.FC = () => {
  const { i18n, t } = useTranslation();

  // Ensure language is stored in localStorage on component mount
  useEffect(() => {
    const currentLanguage = i18n.language || "ru";
    localStorage.setItem("i18nextLng", currentLanguage);
  }, [i18n.language]);

  const handleLanguageChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLanguage: string | null
  ) => {
    if (newLanguage) {
      i18n.changeLanguage(newLanguage);
      // Explicitly save to localStorage
      localStorage.setItem("i18nextLng", newLanguage);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        mt: 2,
        mb: 2,
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        {t("common.language")}
      </Typography>
      <ToggleButtonGroup
        value={i18n.language}
        exclusive
        onChange={handleLanguageChange}
        aria-label="language selection"
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="ru" aria-label="Russian">
          🇷🇺 Русский
        </ToggleButton>
        <ToggleButton value="en" aria-label="English">
          🇬🇧 English
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default LanguageToggle;
