import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TelegramProvider } from "./context/TelegramContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/ui/Toast";
import HomePage from "./pages/HomePage";
import ExercisePage from "./pages/ExercisePage";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/ProfilePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import SettingsPage from "./pages/SettingsPage";
import ComponentShowcase from "./components/ComponentShowcase";

function App() {
  return (
    <TelegramProvider>
      <ThemeContextProvider>
        <ToastProvider>
          <div className="min-h-screen bg-bg text-text font-sans antialiased">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/exercises" element={<ExercisePage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/ui" element={<ComponentShowcase />} />
              </Routes>
            </BrowserRouter>
          </div>
        </ToastProvider>
      </ThemeContextProvider>
    </TelegramProvider>
  );
}

export default App;
