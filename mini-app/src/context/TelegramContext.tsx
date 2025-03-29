import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface TelegramContextType {
  webApp: typeof window.Telegram.WebApp | null;
  user: {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;
  } | null;
  ready: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  ready: false,
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  const [webApp, setWebApp] = useState<typeof window.Telegram.WebApp | null>(
    null
  );
  const [user, setUser] = useState<TelegramContextType["user"]>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!window.Telegram) {
      console.error("Telegram WebApp is not available");
      return;
    }

    const tgWebApp = window.Telegram.WebApp;
    setWebApp(tgWebApp);

    // Set up user data if available
    if (tgWebApp.initDataUnsafe?.user) {
      const { id, first_name, last_name, username } =
        tgWebApp.initDataUnsafe.user;
      setUser({
        id,
        firstName: first_name,
        lastName: last_name,
        username,
      });
    }

    // Signal to Telegram that we are ready
    tgWebApp.ready();
    tgWebApp.expand();

    setReady(true);

    // Set CSS variables for Telegram theme params
    // These will be used as fallbacks and accents, but not override our theme system
    document.documentElement.style.setProperty(
      "--tg-bg-color",
      tgWebApp.themeParams?.bg_color || "#ffffff"
    );
    document.documentElement.style.setProperty(
      "--tg-text-color",
      tgWebApp.themeParams?.text_color || "#000000"
    );
    document.documentElement.style.setProperty(
      "--tg-button-color",
      tgWebApp.themeParams?.button_color || "#2481cc"
    );
    document.documentElement.style.setProperty(
      "--tg-button-text-color",
      tgWebApp.themeParams?.button_text_color || "#ffffff"
    );

    // We no longer set document theme here as it's handled by ThemeContext
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, user, ready }}>
      {children}
    </TelegramContext.Provider>
  );
};
