import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import { useTelegram } from "../context/TelegramContext";
import { userApi } from "../services/api";
import { useTranslation } from "react-i18next";
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
    buttonTextKey: "subscription.currentPlan",
    color: "default",
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
    buttonTextKey: "subscription.subscribeNow",
    color: "primary",
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
    color: "secondary",
  },
];

const SubscriptionPage = () => {
  const { webApp, user } = useTelegram();
  const { t } = useTranslation();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [currentSubscription, setCurrentSubscription] = useState("free");
  const [isLoading, setIsLoading] = useState(true);

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

      // Simulate API call
      // await userApi.updateSubscription(user.id.toString(), tierId, expiryDate.toISOString());

      // Update local state
      setCurrentSubscription(tierId);

      // Hide main button after successful payment
      if (webApp) {
        webApp.MainButton.hide();
      }

      alert(`${t("subscription.currentPlan")}: ${tierId.toUpperCase()}`);
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert(t("common.error"));
    }
  };

  return (
    <PageLayout>
      <SectionHeading
        title={t("subscription.title")}
        subtitle={t("subscription.chooseYourPlan")}
        align="center"
      />

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography>{t("common.loading")}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: "100%",
            overflowX: "hidden",
            mt: 3,
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="stretch"
            justifyContent="center"
            sx={{
              flexWrap: { xs: "wrap", md: "nowrap" },
              margin: "0 auto",
            }}
          >
            {subscriptionTiers.map((tier) => (
              <Grid
                item
                key={tier.id}
                sx={{
                  display: "flex",
                  width: { xs: "100%", sm: "80%", md: "calc(33.333% - 16px)" },
                  maxWidth: { xs: "100%", md: "calc(33.333% - 16px)" },
                  flexShrink: 0,
                  flexGrow: 0,
                }}
              >
                <Paper
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    border:
                      tier.id === currentSubscription
                        ? "2px solid"
                        : "1px solid transparent",
                    borderColor:
                      tier.id === currentSubscription
                        ? `${tier.color}.main`
                        : "divider",
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    "&:hover": {
                      transform:
                        tier.id !== currentSubscription
                          ? "translateY(-8px)"
                          : "none",
                      boxShadow:
                        tier.id !== currentSubscription
                          ? "0 12px 20px rgba(0, 0, 0, 0.1)"
                          : "none",
                    },
                  }}
                  elevation={tier.id === currentSubscription ? 3 : 1}
                >
                  {tier.id === currentSubscription && (
                    <Chip
                      label={t("subscription.currentPlan")}
                      color={tier.color as any}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        fontWeight: 500,
                      }}
                    />
                  )}

                  <Typography variant="h5" component="h2" gutterBottom>
                    {t(tier.nameKey)}
                  </Typography>

                  <Typography variant="h4" color={`${tier.color}.main`}>
                    ${tier.price}
                    <Typography
                      component="span"
                      variant="subtitle1"
                      color="text.secondary"
                    >
                      {tier.billingPeriod && t(tier.billingPeriod)}
                    </Typography>
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 2, mb: 1 }}
                    color="text.secondary"
                  >
                    {t(tier.descriptionKey)}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <List sx={{ flexGrow: 1, mb: 2 }}>
                    {tier.features.map((feature, index) => (
                      <ListItem key={index} dense sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          {feature.available ? (
                            <CheckIcon color={tier.color as any} />
                          ) : (
                            <CloseIcon color="disabled" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={t(feature.textKey)}
                          primaryTypographyProps={{
                            fontSize: "0.875rem",
                            fontWeight: feature.available ? "medium" : "normal",
                            color: feature.available
                              ? "text.primary"
                              : "text.disabled",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ mt: "auto" }}>
                    <ActionButton
                      text={
                        tier.id === currentSubscription
                          ? t("subscription.currentPlan")
                          : t(tier.buttonTextKey)
                      }
                      variant={
                        tier.id === currentSubscription
                          ? "outlined"
                          : "contained"
                      }
                      color={tier.color as any}
                      fullWidth
                      disabled={tier.id === currentSubscription}
                      onClick={() => handleSubscribe(tier.id)}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </PageLayout>
  );
};

export default SubscriptionPage;
