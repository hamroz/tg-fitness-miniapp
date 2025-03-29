import React, { useEffect, useState } from "react";
import { Typography, Box, SxProps, Theme } from "@mui/material";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  spacing?: number;
  sx?: SxProps<Theme>;
  animated?: boolean;
}

/**
 * SectionHeading provides consistent heading styles across the application
 * for page titles and section headings with smooth animations
 */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  align = "left",
  spacing = 3,
  sx = {},
  animated = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [animated]);

  return (
    <Box
      sx={{
        mb: spacing,
        textAlign: align,
        overflow: "hidden",
        ...sx,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          position: "relative",
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
          transition: animated
            ? "transform 0.6s ease-out, opacity 0.6s ease-out"
            : "none",
          "&::after":
            align === "center"
              ? {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  width: isVisible ? "40px" : "0px",
                  height: "3px",
                  backgroundColor: "primary.main",
                  transition: "width 0.8s ease",
                  transform: "translateX(-50%)",
                }
              : align === "left"
              ? {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: isVisible ? "40px" : "0px",
                  height: "3px",
                  backgroundColor: "primary.main",
                  transition: "width 0.8s ease",
                }
              : {},
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            opacity: isVisible ? 0.85 : 0,
            transition: animated
              ? "transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s"
              : "none",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionHeading;
