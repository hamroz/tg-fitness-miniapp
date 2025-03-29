import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  Theme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  theme: Theme;
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

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Get saved theme from localStorage or default to 'light'
    const savedMode = localStorage.getItem("themeMode");
    return (savedMode as ThemeMode) || "light";
  });

  // Create a theme based on current mode
  const theme = React.useMemo(
    () =>
      createTheme({
        spacing: 8, // Base spacing unit (8px)
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // Light mode colors
                primary: {
                  main: "#2481cc", // Telegram blue
                },
                secondary: {
                  main: "#8774e1", // Complementary purple
                },
                background: {
                  default: "#f5f5f5",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#333333",
                  secondary: "#666666",
                },
              }
            : {
                // Dark mode colors
                primary: {
                  main: "#50a8ff", // Brighter blue for dark mode
                },
                secondary: {
                  main: "#9d8df0", // Brighter purple for dark mode
                },
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
                text: {
                  primary: "#e0e0e0",
                  secondary: "#a0a0a0",
                },
              }),
        },
        typography: {
          fontFamily:
            "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          h1: {
            fontWeight: 700,
            fontSize: "2.5rem",
            lineHeight: 1.2,
            marginBottom: "0.5em",
          },
          h2: {
            fontWeight: 700,
            fontSize: "2rem",
            lineHeight: 1.3,
            marginBottom: "0.5em",
          },
          h3: {
            fontWeight: 600,
            fontSize: "1.75rem",
            lineHeight: 1.3,
            marginBottom: "0.5em",
          },
          h4: {
            fontWeight: 600,
            fontSize: "1.5rem",
            lineHeight: 1.4,
            marginBottom: "0.5em",
          },
          h5: {
            fontWeight: 600,
            fontSize: "1.25rem",
            lineHeight: 1.4,
            marginBottom: "0.5em",
          },
          h6: {
            fontWeight: 600,
            fontSize: "1.1rem",
            lineHeight: 1.4,
            marginBottom: "0.5em",
          },
          subtitle1: {
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: 1.5,
            marginBottom: "0.5em",
          },
          subtitle2: {
            fontWeight: 500,
            fontSize: "0.875rem",
            lineHeight: 1.5,
            marginBottom: "0.5em",
          },
          body1: {
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: 1.6,
            marginBottom: "1em",
          },
          body2: {
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: 1.6,
            marginBottom: "1em",
          },
          button: {
            fontWeight: 500,
            fontSize: "0.875rem",
            textTransform: "none",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 500,
                fontFamily: "'Open Sans', sans-serif",
                padding: "8px 16px",
                minHeight: "42px",
              },
              sizeLarge: {
                padding: "12px 24px",
                fontSize: "1rem",
              },
              sizeSmall: {
                padding: "4px 12px",
                fontSize: "0.8125rem",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: 24,
              },
            },
          },
          // Enhanced card styling for both themes
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow:
                  mode === "light"
                    ? "0 4px 12px rgba(0,0,0,0.05)"
                    : "0 4px 12px rgba(0,0,0,0.2)",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    mode === "light"
                      ? "0 8px 16px rgba(0,0,0,0.1)"
                      : "0 8px 16px rgba(0,0,0,0.4)",
                },
                borderRadius: 8,
                padding: 24,
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              root: {
                fontFamily: "'Open Sans', sans-serif",
              },
              gutterBottom: {
                marginBottom: "1em",
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                fontFamily: "'Open Sans', sans-serif",
                fontSize: "1rem",
              },
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: {
                fontWeight: 500,
                fontSize: "0.875rem",
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                margin: "16px 0",
              },
            },
          },
          MuiList: {
            styleOverrides: {
              root: {
                padding: "8px 0",
              },
            },
          },
          MuiListItem: {
            styleOverrides: {
              root: {
                padding: "8px 16px",
              },
            },
          },
          MuiListItemText: {
            styleOverrides: {
              primary: {
                fontWeight: 500,
              },
              secondary: {
                fontSize: "0.875rem",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [mode]
  );

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  // Apply theme CSS variables to the document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
