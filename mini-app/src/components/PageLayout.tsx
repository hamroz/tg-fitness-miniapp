import React, { ReactNode, useEffect, useState } from "react";
import { Container, Box, useTheme, useMediaQuery, Fade } from "@mui/material";
import AppBottomNavigation from "./AppBottomNavigation";

interface PageLayoutProps {
  children: ReactNode;
  disableBottomNavigation?: boolean;
}

/**
 * PageLayout provides a consistent layout structure for all app pages
 * with responsive width control, standard padding and smooth animations.
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  disableBottomNavigation = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isVisible, setIsVisible] = useState(false);

  // Animation for page entry
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 3,
        pb: disableBottomNavigation ? 3 : 7,
        px: { xs: 2, sm: 3 },
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Fade in={isVisible} timeout={600}>
        <Box
          sx={{
            maxWidth: "100%",
            mx: "auto",
            position: "relative",
            animation: `${isVisible ? "fadeIn 0.8s ease-out" : "none"}`,
            "@keyframes fadeIn": {
              "0%": {
                opacity: 0,
                transform: "translateY(20px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {children}
        </Box>
      </Fade>

      {!disableBottomNavigation && <AppBottomNavigation />}
    </Container>
  );
};

export default PageLayout;
