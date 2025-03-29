import React from "react";
import { Box, Paper, Typography, useTheme as useMuiTheme } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { styled } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { useTranslation } from "react-i18next";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  height: 120,
  width: "100%",
}));

const ThemeIconContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  transition: "all 0.3s ease",
}));

const ThemeDisplay: React.FC = () => {
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const { t, i18n } = useTranslation();

  const isDark = mode === "dark";

  return (
    <StyledPaper
      elevation={3}
      sx={{
        background: isDark
          ? "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)"
          : "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        color: isDark ? "#fff" : "#333",
        border: `1px solid ${
          isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
        }`,
      }}
    >
      <ThemeIconContainer>
        {isDark ? (
          <NightsStayIcon sx={{ fontSize: 32, color: "#9d8df0" }} />
        ) : (
          <WbSunnyIcon sx={{ fontSize: 32, color: "#f9a825" }} />
        )}
      </ThemeIconContainer>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          key={`mode-title-${i18n.language}`}
        >
          {isDark ? t("settings.darkMode") : t("settings.lightMode")}
        </Typography>
        <Typography
          variant="body2"
          sx={{ opacity: 0.8, mt: 1 }}
          key={`mode-desc-${i18n.language}`}
        >
          {isDark
            ? t("settings.optimizedForNightViewing")
            : t("settings.optimizedForDayViewing")}
        </Typography>
      </Box>
    </StyledPaper>
  );
};

export default ThemeDisplay;
