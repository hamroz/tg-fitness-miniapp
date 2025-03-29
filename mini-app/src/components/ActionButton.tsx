import React, { useState, ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  loading?: boolean;
  animated?: boolean;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
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
  disabled = false,
  loading = false,
  animated = true,
  className = "",
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

  const getVariantClasses = () => {
    switch (variant) {
      case "contained":
        return `bg-${
          color === "primary" ? "tg-button" : color
        } text-white shadow hover:shadow-md`;
      case "outlined":
        return `border border-${
          color === "primary" ? "tg-button" : color
        } text-${color === "primary" ? "tg-button" : color}`;
      case "text":
        return `text-${color === "primary" ? "tg-button" : color}`;
      default:
        return "";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "py-1 px-3 text-sm";
      case "large":
        return "py-3 px-6 text-lg";
      default:
        return "py-2 px-4";
    }
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        mt-4 rounded font-medium relative overflow-hidden transition-all duration-300 ease-in-out
        ${fullWidth ? "w-full" : ""}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${isPressed ? "scale-[0.97]" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
        </div>
      )}
      <span className={loading ? "invisible" : "visible"}>{text}</span>
    </button>
  );
};

export default ActionButton;
