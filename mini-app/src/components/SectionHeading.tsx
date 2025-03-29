import React, { useEffect, useState } from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  spacing?: number;
  className?: string;
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
  className = "",
  animated = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [animated]);

  const getAlignmentClass = () => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const getSpacingClass = () => {
    return `mb-${spacing}`;
  };

  return (
    <div
      className={`${getSpacingClass()} ${getAlignmentClass()} overflow-hidden ${className}`}
    >
      <h1
        className={`relative text-2xl font-semibold mb-2 ${
          animated ? "transition-all duration-300 ease-out" : ""
        } ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
        style={{
          ...(align === "center" && {
            "--tw-after-content": "''",
          }),
        }}
      >
        {title}
        {align === "center" && (
          <span
            className={`absolute -bottom-2 left-1/2 h-[3px] bg-accent -translate-x-1/2 transition-all duration-300 ease-in-out ${
              isVisible ? "w-10" : "w-0"
            }`}
          />
        )}
        {align === "left" && (
          <span
            className={`absolute -bottom-2 left-0 h-[3px] bg-accent transition-all duration-300 ease-in-out ${
              isVisible ? "w-10" : "w-0"
            }`}
          />
        )}
      </h1>

      {subtitle && (
        <p
          className={`text-text-secondary ${
            animated ? "transition-all duration-300 ease-out" : ""
          } ${
            isVisible ? "translate-y-0 opacity-85" : "translate-y-5 opacity-0"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
