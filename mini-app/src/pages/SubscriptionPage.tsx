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

// Subscription tiers data
const subscriptionTiers = [
  {
    id: "free",
    name: "Free",
    price: 0,
    billingPeriod: "",
    description: "Basic access to fitness tracking",
    features: [
      { text: "Basic exercises", available: true },
      { text: "Exercise timer", available: true },
      { text: "Progress tracking", available: true },
      { text: "Premium exercises", available: false },
      { text: "Personalized workout plans", available: false },
      { text: "Priority support", available: false },
    ],
    buttonText: "Current Plan",
    color: "default",
  },
  {
    id: "premium",
    name: "Premium",
    price: 5,
    billingPeriod: "/month",
    description: "Full access to all features",
    features: [
      { text: "Basic exercises", available: true },
      { text: "Exercise timer", available: true },
      { text: "Progress tracking", available: true },
      { text: "Premium exercises", available: true },
      { text: "Personalized workout plans", available: true },
      { text: "Priority support", available: true },
    ],
    buttonText: "Subscribe Now",
    color: "primary",
  },
  {
    id: "individual",
    name: "Individual",
    price: 10,
    billingPeriod: "/month",
    description: "Custom fitness plan with personal coaching",
    features: [
      { text: "Basic exercises", available: true },
      { text: "Exercise timer", available: true },
      { text: "Progress tracking", available: true },
      { text: "Premium exercises", available: true },
      { text: "Personalized workout plans", available: true },
      { text: "Priority support", available: true },
      { text: "Custom fitness plan", available: true },
      { text: "Personal coaching", available: true },
    ],
    buttonText: "Get Custom Plan",
    color: "secondary",
  },
];

const SubscriptionPage = () => {
  const { webApp, user } = useTelegram();
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
        text: "CHECKOUT",
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
  }, [webApp]);

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
      webApp.MainButton.setText(`CHECKOUT - ${tierId.toUpperCase()}`);
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
      alert("Failed to initiate payment. Please try again.");
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
      `YooMoney payment for ${tier.name} subscription would be initiated here.`
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
        `Telegram payment for ${tier.name} subscription would be initiated here.`
      );

      // In a real implementation:
      // 1. The bot would receive a command to start payment
      // 2. Bot uses answerPreCheckoutQuery to process payment

      // For demo, simulate success after 2 seconds
      setTimeout(() => {
        updateSubscription(tier.id);
      }, 2000);
    } else {
      alert("Telegram payment is only available inside the Telegram app.");
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

      alert(`Subscription updated to ${tierId.toUpperCase()}`);
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Failed to update subscription. Please try again.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Subscription Plans
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Choose the plan that best fits your fitness goals
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {subscriptionTiers.map((tier) => (
          <Grid item xs={12} sm={6} md={4} key={tier.id}>
            <Paper
              elevation={tier.id === currentSubscription ? 8 : 2}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative",
                transition: "all 0.3s ease",
                border:
                  tier.id === currentSubscription
                    ? `2px solid ${
                        tier.color === "primary"
                          ? "#2481cc"
                          : tier.color === "secondary"
                          ? "#8774e1"
                          : "#ccc"
                      }`
                    : "none",
              }}
            >
              {tier.id === currentSubscription && (
                <Chip
                  label="Current Plan"
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                />
              )}

              <Typography variant="h5" component="h2" gutterBottom>
                {tier.name}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography component="span" variant="h4">
                  ${tier.price}
                </Typography>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="text.secondary"
                >
                  {tier.billingPeriod}
                </Typography>
              </Box>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {tier.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <List sx={{ flexGrow: 1, mb: 2 }}>
                {tier.features.map((feature, idx) => (
                  <ListItem key={idx} dense>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {feature.available ? (
                        <CheckIcon color="success" fontSize="small" />
                      ) : (
                        <CloseIcon color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={feature.text}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: !feature.available
                          ? { color: "text.disabled" }
                          : {},
                      }}
                    />
                    {!feature.available && (
                      <LockIcon fontSize="small" color="disabled" />
                    )}
                  </ListItem>
                ))}
              </List>

              <Button
                fullWidth
                variant={
                  tier.id === currentSubscription ? "outlined" : "contained"
                }
                color={
                  tier.color === "primary"
                    ? "primary"
                    : tier.color === "secondary"
                    ? "secondary"
                    : "inherit"
                }
                onClick={() => handleSubscribe(tier.id)}
                disabled={tier.id === currentSubscription || isLoading}
              >
                {tier.id === currentSubscription
                  ? "Current Plan"
                  : tier.buttonText}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubscriptionPage;
