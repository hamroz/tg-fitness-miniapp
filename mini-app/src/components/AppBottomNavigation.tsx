import React, { useState, useEffect } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TimelineIcon from "@mui/icons-material/Timeline";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const navItems = [
  { path: "/", icon: <HomeIcon />, labelKey: "navigation.home" },
  {
    path: "/exercises",
    icon: <FitnessCenterIcon />,
    labelKey: "navigation.exercises",
  },
  {
    path: "/progress",
    icon: <TimelineIcon />,
    labelKey: "navigation.progress",
  },
  { path: "/profile", icon: <PersonIcon />, labelKey: "navigation.profile" },
  {
    path: "/settings",
    icon: <SettingsIcon />,
    labelKey: "navigation.settings",
  },
];

const AppBottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [value, setValue] = useState(-1);

  // Update the value when location changes
  useEffect(() => {
    const currentIndex = navItems.findIndex(
      (item) => item.path === location.pathname
    );
    setValue(currentIndex >= 0 ? currentIndex : 0);
  }, [location.pathname]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    // Only navigate if it's a different page to avoid unnecessary rerenders
    if (navItems[newValue].path !== location.pathname) {
      navigate(navItems[newValue].path);
    }
  };

  // Fixed height to ensure consistency across all pages
  const NAVBAR_HEIGHT = 56;

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: NAVBAR_HEIGHT,
        boxShadow: 3,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
        sx={{
          width: "100%",
          height: "100%",
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            maxWidth: "100%",
            padding: "6px 0",
            flex: "1 1 20%", // Divide evenly among 5 items
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.65rem",
            fontWeight: "400",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "&.Mui-selected": {
              fontSize: "0.75rem",
              fontWeight: "500",
            },
          },
          "& .MuiBottomNavigationAction-label.Mui-selected": {
            transform: "none",
          },
          "& .MuiSvgIcon-root": {
            width: "1.5rem",
            height: "1.5rem",
          },
        }}
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={t(item.labelKey)}
            icon={item.icon}
            sx={{
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default AppBottomNavigation;
