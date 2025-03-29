import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTelegram } from "../context/TelegramContext";
import { userApi } from "../services/api";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";
import ContentCard from "../components/ContentCard";
import ActionButton from "../components/ActionButton";
import SectionHeading from "../components/SectionHeading";

const HomePage = () => {
  const { user, webApp } = useTelegram();
  const { t } = useTranslation();
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [userSubscription, setUserSubscription] = useState("free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch user data and check for phone number and subscription
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (webApp) {
      // Show back button if coming from Telegram
      webApp.BackButton.hide();
    }
  }, [webApp]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      if (user?.id) {
        const userData = await userApi.getUserData(user.id.toString());

        // Check if user has phone number
        setHasPhoneNumber(!!userData?.phone);

        // Check subscription type
        if (userData?.subscription) {
          setUserSubscription(userData.subscription);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get subscription display name and color
  const getSubscriptionInfo = () => {
    switch (userSubscription) {
      case "premium":
        return {
          name: t("subscription.premiumPlan"),
          color: "bg-tg-button text-white",
        };
      case "individual":
        return {
          name: t("subscription.individualPlan"),
          color: "bg-accent text-white",
        };
      default:
        return {
          name: t("subscription.freePlan"),
          color: "bg-gray-200 text-gray-800",
        };
    }
  };

  const subscriptionInfo = getSubscriptionInfo();

  return (
    <PageLayout>
      <div
        className="relative mb-8 rounded-lg bg-cover bg-center p-6 text-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)",
        }}
      >
        {!isLoading && (
          <span
            className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs ${subscriptionInfo.color}`}
          >
            {`${subscriptionInfo.name} ${t("subscription.currentPlan")}`}
          </span>
        )}
        <h1 className="mb-2 text-2xl font-bold">Fitness Trainer</h1>
        <p className="text-sm">
          {user
            ? `${t("home.welcome")}, ${user.firstName}!`
            : t("home.welcome")}
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        {!hasPhoneNumber && (
          <ContentCard className="bg-tg-button/10">
            <h2 className="mb-2 font-semibold">{t("profile.personalInfo")}</h2>
            <p className="mb-4 text-sm">{t("profile.phone")}</p>
            <ActionButton
              text={t("profile.personalInfo")}
              color="primary"
              fullWidth
              onClick={() => (window.location.href = "/profile")}
            />
          </ContentCard>
        )}

        <ContentCard>
          <h2 className="mb-2 font-semibold">{t("navigation.exercises")}</h2>
          <p className="mb-4 text-sm">{t("exercises.searchPlaceholder")}</p>
          <ActionButton
            text={t("navigation.exercises")}
            color="primary"
            fullWidth
            onClick={() => (window.location.href = "/exercises")}
          />
        </ContentCard>

        <ContentCard>
          <h2 className="mb-2 font-semibold">{t("navigation.progress")}</h2>
          <p className="mb-4 text-sm">{t("home.recentWorkouts")}</p>
          <ActionButton
            text={t("navigation.progress")}
            color="primary"
            fullWidth
            onClick={() => (window.location.href = "/progress")}
          />
        </ContentCard>

        <ContentCard
          className={userSubscription === "free" ? "bg-accent/10" : ""}
        >
          <h2 className="mb-2 font-semibold">
            {userSubscription === "free"
              ? t("subscription.upgradeNow")
              : t("subscription.yourPlan")}
          </h2>
          <p className="mb-4 text-sm">
            {userSubscription === "free"
              ? t("subscription.premiumFeatures")
              : `${t("subscription.currentPlan")}: ${subscriptionInfo.name}`}
          </p>
          <ActionButton
            text={
              userSubscription === "free"
                ? t("subscription.choosePlan")
                : t("subscription.changePlan")
            }
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => (window.location.href = "/subscription")}
          />
        </ContentCard>
      </div>
    </PageLayout>
  );
};

export default HomePage;
