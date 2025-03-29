import React, { ReactNode, useState } from "react";
import { Paper, Typography, Box, Divider, SxProps, Theme } from "@mui/material";

interface ContentCardProps {
  title?: string;
  children: ReactNode;
  divider?: boolean;
  sx?: SxProps<Theme>;
  titleSx?: SxProps<Theme>;
  interactive?: boolean;
}

/**
 * ContentCard provides consistent card styling for content sections
 * across the application, with smooth hover animations
 */
const ContentCard: React.FC<ContentCardProps> = ({
  title,
  children,
  divider = false,
  sx = {},
  titleSx = {},
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseEnter = () => interactive && setIsHovered(true);
  const handleMouseLeave = () => {
    interactive && setIsHovered(false);
    interactive && setIsPressed(false);
  };
  const handleMouseDown = () => interactive && setIsPressed(true);
  const handleMouseUp = () => interactive && setIsPressed(false);

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        transform: isPressed
          ? "scale(0.98)"
          : isHovered
          ? "translateY(-4px)"
          : "translateY(0)",
        boxShadow: isHovered
          ? "0 8px 17px rgba(0, 0, 0, 0.1)"
          : "0 1px 3px rgba(0, 0, 0, 0.08)",
        position: "relative",
        overflow: "hidden",
        "&::after": interactive
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.05)",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
            }
          : {},
        ...sx,
      }}
      elevation={isHovered ? 4 : 1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {title && (
        <>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              transition: "transform 0.2s ease, color 0.2s ease",
              transform: isHovered ? "translateX(4px)" : "translateX(0)",
              ...titleSx,
            }}
          >
            {title}
          </Typography>

          {divider && (
            <Divider
              sx={{
                mb: 2,
                transition: "width 0.3s ease",
                width: isHovered ? "100%" : "95%",
                mx: "auto",
              }}
            />
          )}
        </>
      )}

      <Box
        sx={{
          transition: "opacity 0.3s ease, transform 0.3s ease",
          opacity: isPressed ? 0.9 : 1,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default ContentCard;
