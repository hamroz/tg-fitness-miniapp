import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import { useTelegram } from "../context/TelegramContext";
import { userApi } from "../services/api";
import { useTranslation } from "react-i18next";
import AppBottomNavigation from "../components/AppBottomNavigation";

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

  // Add the rest of the component rendering here
  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 7 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("subscription.choosePlan")}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {subscriptionTiers.map((tier) => (
          <Grid item xs={12} md={4} key={tier.id}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border:
                  tier.id === currentSubscription ? "2px solid" : "1px solid",
                borderColor:
                  tier.id === currentSubscription
                    ? `${tier.color}.main`
                    : "divider",
              }}
            >
              <Box sx={{ mb: 2 }}>
                {tier.id === currentSubscription && (
                  <Chip
                    label={t("subscription.currentPlan")}
                    color={tier.color as any}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                )}
                <Typography variant="h5" component="h2" gutterBottom>
                  {t(tier.nameKey)}
                </Typography>
                {tier.price > 0 ? (
                  <Typography variant="h4" color="text.primary">
                    ${tier.price}
                    <Typography
                      component="span"
                      variant="subtitle1"
                      sx={{ verticalAlign: "baseline" }}
                    >
                      {tier.billingPeriod}
                    </Typography>
                  </Typography>
                ) : (
                  <Typography variant="h4" color="text.primary">
                    {t("common.free")}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {t(tier.descriptionKey)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <List sx={{ mb: 2, flexGrow: 1 }}>
                {tier.features.map((feature, idx) => (
                  <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {feature.available ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={feature.textKey} />
                  </ListItem>
                ))}
              </List>

              <Button
                fullWidth
                variant={
                  tier.id === currentSubscription ? "outlined" : "contained"
                }
                color={tier.color as any}
                onClick={() => handleSubscribe(tier.id)}
                disabled={tier.id === currentSubscription}
              >
                {tier.id === currentSubscription
                  ? t("subscription.currentPlan")
                  : t(tier.buttonTextKey)}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <AppBottomNavigation />
    </Container>
  );
};

export default SubscriptionPage;
