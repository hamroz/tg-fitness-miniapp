import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { TelegramProvider } from "./context/TelegramContext";
import HomePage from "./pages/HomePage";
import ExercisePage from "./pages/ExercisePage";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/ProfilePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import SettingsPage from "./pages/SettingsPage";

// Create a theme instance based on Telegram's theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2481cc", // Telegram blue
    },
    secondary: {
      main: "#8774e1", // A complementary purple
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TelegramProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/exercises" element={<ExercisePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Router>
      </TelegramProvider>
    </ThemeProvider>
  );
}

export default App;
