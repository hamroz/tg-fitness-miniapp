import React, { useState } from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";

interface ActionButtonProps extends ButtonProps {
  text: string;
  loading?: boolean;
  animated?: boolean;
}

/**
 * ActionButton provides consistent button styling with animations
 * Use for primary actions across the application
 */
const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  variant = "contained",
  color = "primary",
  fullWidth = false,
  size = "medium",
  sx = {},
  disabled = false,
  loading = false,
  animated = true,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseEnter = () =>
    animated && !disabled && !loading && setIsHovered(true);
  const handleMouseLeave = () => {
    animated && setIsHovered(false);
    animated && setIsPressed(false);
  };
  const handleMouseDown = () =>
    animated && !disabled && !loading && setIsPressed(true);
  const handleMouseUp = () =>
    animated && !disabled && !loading && setIsPressed(false);

  return (
    <Button
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled || loading}
      sx={{
        mt: 2,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        transform: isPressed
          ? "scale(0.97)"
          : isHovered
          ? "translateY(-2px)"
          : "translateY(0)",
        boxShadow:
          variant === "contained" && isHovered && !disabled
            ? "0 6px 12px rgba(0, 0, 0, 0.15)"
            : undefined,
        "&::after":
          animated && variant === "contained"
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                transform: "translateX(-100%)",
                animation: isHovered ? "ripple 1.5s infinite" : "none",
                "@keyframes ripple": {
                  "0%": {
                    transform: "translateX(-100%)",
                  },
                  "100%": {
                    transform: "translateX(100%)",
                  },
                },
                pointerEvents: "none",
              }
            : {},
        ...sx,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={24}
          color="inherit"
          sx={{
            position: "absolute",
            animation: "spin 1s infinite linear",
            "@keyframes spin": {
              "0%": {
                transform: "rotate(0deg)",
              },
              "100%": {
                transform: "rotate(360deg)",
              },
            },
          }}
        />
      ) : null}
      <span style={{ visibility: loading ? "hidden" : "visible" }}>{text}</span>
    </Button>
  );
};

export default ActionButton;
