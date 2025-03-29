import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "../components/PhoneInput";
import { useTelegram } from "../context/TelegramContext";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import PageLayout from "../components/PageLayout";
import SectionHeading from "../components/SectionHeading";
import ContentCard from "../components/ContentCard";

const ProfilePage = () => {
  const { webApp } = useTelegram();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (webApp) {
      // Enable back button in the Telegram UI
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => {
        window.history.back();
      });
    }

    return () => {
      if (webApp) {
        webApp.BackButton.offClick();
      }
    };
  }, [webApp]);

  const handlePhoneNumberSubmit = (phoneNumber: string) => {
    // In a real app, we would save this to the database
    console.log("Phone number submitted:", phoneNumber);

    // Redirect to home page after successful submission
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <PageLayout>
      <SectionHeading
        title={t("profile.personalInfo")}
        // subtitle={t("profile.phone")}
        align="center"
      />

      <ContentCard>
        <PhoneInput onSubmit={handlePhoneNumberSubmit} />
      </ContentCard>

      <ContentCard title={t("profile.preferredLanguage")} divider>
        <LanguageToggle />
      </ContentCard>
    </PageLayout>
  );
};

export default ProfilePage;
