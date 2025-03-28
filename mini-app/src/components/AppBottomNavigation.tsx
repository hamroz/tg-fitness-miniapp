import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
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

  // Set the initial value based on the current path
  const [value, setValue] = useState(
    navItems.findIndex((item) => item.path === location.pathname)
  );

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(navItems[newValue].path);
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={t(item.labelKey)}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default AppBottomNavigation;
