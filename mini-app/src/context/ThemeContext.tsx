import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  ReactNode,
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

// Use this safe version of useLayoutEffect that falls back to useEffect during SSR
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Get saved theme from localStorage or default to 'light'
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("themeMode");
      return (savedMode as ThemeMode) || "light";
    }
    return "light";
  });

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Update localStorage and document theme attribute when mode changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("themeMode", mode);
      document.documentElement.setAttribute("data-theme", mode);
    }
  }, [mode]);

  // Make sure theme is applied immediately on mount
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
