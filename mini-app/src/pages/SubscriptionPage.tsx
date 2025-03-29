import { useState, useEffect, useLayoutEffect } from "react";
import { useTelegram } from "../context/TelegramContext";
import { userApi } from "../services/api";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import PageLayout from "../components/PageLayout";
import SectionHeading from "../components/SectionHeading";
import ActionButton from "../components/ActionButton";

// Subscription tiers data - we'll translate this dynamically
const subscriptionTiers = [
  {
    id: "free",
    nameKey: "subscription.freePlan",
    price: 0,
    billingPeriod: "",
    descriptionKey: "subscription.freePlanFeatures",
    features: [
      { textKey: "Basic exercises", available: true },
      { textKey: "Exercise timer", available: true },
      { textKey: "Progress tracking", available: true },
      { textKey: "Premium exercises", available: false },
      { textKey: "Personalized workout plans", available: false },
      { textKey: "Priority support", available: false },
    ],
    buttonTextKey: "subscription.yourCurrentPlan",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    textColor: "text-gray-700",
  },
  {
    id: "premium",
    nameKey: "subscription.premiumPlan",
    price: 5,
    billingPeriod: "/month",
    descriptionKey: "subscription.premiumPlanFeatures",
    features: [
      { textKey: "Basic exercises", available: true },
      { textKey: "Exercise timer", available: true },
      { textKey: "Progress tracking", available: true },
      { textKey: "Premium exercises", available: true },
      { textKey: "Personalized workout plans", available: true },
      { textKey: "Priority support", available: true },
    ],
    buttonTextKey: "subscription.getPremium",
    color: "bg-tg-button text-white border-tg-button",
    textColor: "text-tg-button",
  },
  {
    id: "individual",
    nameKey: "subscription.individualPlan",
    price: 10,
    billingPeriod: "/month",
    descriptionKey: "subscription.individualPlanFeatures",
    features: [
      { textKey: "Basic exercises", available: true },
      { textKey: "Exercise timer", available: true },
      { textKey: "Progress tracking", available: true },
      { textKey: "Premium exercises", available: true },
      { textKey: "Personalized workout plans", available: true },
      { textKey: "Priority support", available: true },
      { textKey: "Custom fitness plan", available: true },
      { textKey: "Personal coaching", available: true },
    ],
    buttonTextKey: "subscription.getIndividual",
    color: "bg-accent text-white border-accent",
    textColor: "text-accent",
  },
];

const SubscriptionPage = () => {
  const { webApp, user } = useTelegram();
  const { t } = useTranslation();
  const { mode } = useTheme();
  const [currentSubscription, setCurrentSubscription] = useState("free");
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Delay initial render slightly to ensure theme is applied
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsReady(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Apply theme class to prevent flash
  useLayoutEffect(() => {
    document.documentElement.classList.add("theme-applied");
    return () => {
      document.documentElement.classList.remove("theme-applied");
    };
  }, []);

  useEffect(() => {
    if (webApp) {
      // Configure Telegram back button
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => {
        window.history.back();
      });

      // Make main button visible and customizable
      webApp.MainButton.setParams({
        text: t("subscription.subscribeNow").toUpperCase(),
        color: "#2481cc",
        text_color: "#ffffff",
        is_active: false,
        is_visible: false,
      });
    }

    return () => {
      if (webApp) {
        webApp.BackButton.offClick();
        webApp.MainButton.hide();
      }
    };
  }, [webApp, t]);

  useEffect(() => {
    // Fetch user's current subscription
    const fetchUserSubscription = async () => {
      try {
        if (user?.id) {
          setIsLoading(true);
          const userData = await userApi.getUserData(user.id.toString());
          if (userData?.subscription) {
            setCurrentSubscription(userData.subscription);
          }
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSubscription();
  }, [user]);

  const handleSubscribe = (tierId: string) => {
    if (tierId === currentSubscription) {
      return; // Already subscribed
    }

    if (webApp) {
      // Show the main button to proceed with payment
      webApp.MainButton.setText(
        `${t(
          "subscription.subscribeNow"
        ).toUpperCase()} - ${tierId.toUpperCase()}`
      );
      webApp.MainButton.show();
      webApp.MainButton.onClick(() => {
        initiatePayment(tierId);
      });
    } else {
      // Fallback for when not inside Telegram
      initiatePayment(tierId);
    }
  };

  const initiatePayment = async (tierId: string) => {
    try {
      // Different payment approaches based on tier and location
      const tier = subscriptionTiers.find((t) => t.id === tierId);

      if (tier?.price === 0) {
        // Free tier - no payment needed
        await updateSubscription(tierId);
        return;
      }

      // Determine the user's region (simplified example)
      const isRussianUser = user?.id
        ? await checkIfRussianUser(user.id.toString())
        : false;

      if (isRussianUser) {
        // Russian users use YooMoney
        initiateYooMoneyPayment(tier);
      } else {
        // International users use Telegram Payments
        initiateTelegramPayment(tier);
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert(t("common.error"));
    }
  };

  const checkIfRussianUser = async (userId: string): Promise<boolean> => {
    // In a real app, check user's country/language preference in the database
    // Simplified example - always assume international for demo
    return false;
  };

  const initiateYooMoneyPayment = (tier: any) => {
    // YooMoney integration
    // This would open a payment form or redirect to YooMoney
    alert(
      `YooMoney ${t("subscription.paymentMethods")} ${t(tier.nameKey)} ${t(
        "subscription.subscribeNow"
      )}`
    );

    // In the real implementation, there would be:
    // 1. API call to your backend to create a payment
    // 2. Backend generates a YooMoney payment link
    // 3. Redirect the user or open in a new window

    // For demo purposes, simulate a successful payment
    // In production, this would happen after payment callback
    setTimeout(() => {
      updateSubscription(tier.id);
    }, 2000);
  };

  const initiateTelegramPayment = (tier: any) => {
    if (webApp) {
      alert(
        `Telegram ${t("subscription.paymentMethods")} ${t(tier.nameKey)} ${t(
          "subscription.subscribeNow"
        )}`
      );

      // In a real implementation:
      // 1. The bot would receive a command to start payment
      // 2. Bot uses answerPreCheckoutQuery to process payment

      // For demo, simulate success after 2 seconds
      setTimeout(() => {
        updateSubscription(tier.id);
      }, 2000);
    } else {
      alert(t("common.error"));
    }
  };

  const updateSubscription = async (tierId: string) => {
    try {
      if (!user?.id) {
        throw new Error("User ID not available");
      }

      // In a real app, this would call your backend API to update the subscription
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1); // Expire in 1 month

      // Update local state
      setCurrentSubscription(tierId);
      alert(t("subscription.subscriptionUpdated"));

      // Hide the main button after subscription
      if (webApp) {
        webApp.MainButton.hide();
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert(t("common.error"));
    }
  };

  return isReady ? (
    <PageLayout>
      <SectionHeading
        title={t("subscription.choosePlan")}
        // subtitle={t("subscription.choosePlanDesc")}
        align="center"
      />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative overflow-hidden rounded-lg border ${
              currentSubscription === tier.id
                ? "border-2 border-accent shadow-md"
                : "border-border"
            } transition-all duration-300 hover:shadow-lg`}
          >
            {currentSubscription === tier.id && (
              <div className="absolute right-0 top-0 bg-accent px-3 py-1 text-xs font-medium text-white">
                {t("subscription.currentPlan")}
              </div>
            )}

            <div
              className={`p-6 ${
                tier.id === "premium"
                  ? "bg-tg-button/5"
                  : tier.id === "individual"
                  ? "bg-accent/5"
                  : ""
              }`}
            >
              <h3 className="text-lg font-semibold">{t(tier.nameKey)}</h3>

              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">${tier.price}</span>
                <span className="ml-1 text-sm text-text-secondary">
                  {tier.billingPeriod}
                </span>
              </div>

              <p className="mt-4 text-sm text-text-secondary">
                {t(tier.descriptionKey)}
              </p>
            </div>

            <div className="border-t border-border bg-paper/50 px-6 py-4">
              <h4 className="text-sm font-semibold uppercase">
                {t("subscription.features")}
              </h4>
              <ul className="mt-2 space-y-2">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    {feature.available ? (
                      <svg
                        className="mr-2 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="mr-2 h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span
                      className={
                        feature.available
                          ? ""
                          : "text-text-secondary line-through"
                      }
                    >
                      {t(feature.textKey)}
                    </span>
                    {!feature.available && tier.id === "free" && (
                      <svg
                        className="ml-1 h-4 w-4 text-text-secondary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6">
              <ActionButton
                text={
                  currentSubscription === tier.id
                    ? t("subscription.yourCurrentPlan")
                    : t(tier.buttonTextKey)
                }
                variant={
                  currentSubscription === tier.id ? "outlined" : "contained"
                }
                color="primary"
                fullWidth
                disabled={currentSubscription === tier.id}
                onClick={() => handleSubscribe(tier.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  ) : null;
};

export default SubscriptionPage;
