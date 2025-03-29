import React, { ReactNode, useState } from "react";

interface ContentCardProps {
  title?: string;
  children: ReactNode;
  divider?: boolean;
  className?: string;
  titleClassName?: string;
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
  className = "",
  titleClassName = "",
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
    <div
      className={`bg-paper p-6 mb-6 rounded-lg shadow transition-all duration-300 ease-in-out relative overflow-hidden
        ${
          isPressed
            ? "scale-[0.98]"
            : isHovered
            ? "-translate-y-1"
            : "translate-y-0"
        }
        ${isHovered ? "shadow-lg" : "shadow"}
        ${interactive && isHovered ? "after:opacity-100" : "after:opacity-0"}
        ${className}
      `}
      style={{
        ...(interactive
          ? {
              "--tw-after-content": "''",
              position: "relative",
            }
          : {}),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {title && (
        <>
          <h2
            className={`text-lg font-semibold mb-2 transition-all duration-200 ease-in-out
              ${isHovered ? "translate-x-1" : "translate-x-0"}
              ${titleClassName}
            `}
          >
            {title}
          </h2>

          {divider && (
            <hr
              className={`mb-4 mx-auto transition-all duration-300 ease-in-out
                ${isHovered ? "w-full" : "w-[95%]"}
                border-border
              `}
            />
          )}
        </>
      )}

      <div
        className={`transition-all duration-300 ease-in-out
          ${isPressed ? "opacity-90" : "opacity-100"}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default ContentCard;
