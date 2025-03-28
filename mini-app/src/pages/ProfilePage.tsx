import { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhoneInput from "../components/PhoneInput";
import { useTelegram } from "../context/TelegramContext";

const ProfilePage = () => {
  const { webApp } = useTelegram();
  const navigate = useNavigate();

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
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Complete Your Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please provide your phone number so we can contact you about your
          fitness journey.
        </Typography>
      </Box>

      <PhoneInput onSubmit={handlePhoneNumberSubmit} />
    </Container>
  );
};

export default ProfilePage;
