import React, { useState, useRef, useEffect } from "react";

type TooltipPosition = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  contentClassName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  delay = 300,
  className = "",
  contentClassName = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const positionStyles = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2",
  };

  const arrowPositions = {
    top: "bottom-0 left-1/2 transform translate-y-full -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent",
    right:
      "left-0 top-1/2 transform -translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent",
    bottom:
      "top-0 left-1/2 transform -translate-y-full -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent",
    left: "right-0 top-1/2 transform translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent",
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      ref={containerRef}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm 
            max-w-xs whitespace-normal pointer-events-none
            opacity-0 animate-fadeIn
            ${positionStyles[position]}
            ${contentClassName}
          `}
          style={{ animationFillMode: "forwards" }}
          role="tooltip"
        >
          {content}
          <div
            className={`
              absolute w-0 h-0 
              border-4 border-solid border-gray-900
              ${arrowPositions[position]}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
