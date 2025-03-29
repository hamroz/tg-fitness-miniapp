import React, { ReactNode, useEffect, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(false);

  // Animation for page entry
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 md:px-8 lg:px-12 pb-24 transition-all duration-300 ease-in-out">
      <div
        className={`max-w-full mx-auto relative ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        } transition-all duration-600 ease-out`}
      >
        {children}
      </div>

      {!disableBottomNavigation && <AppBottomNavigation />}
    </div>
  );
};

export default PageLayout;
