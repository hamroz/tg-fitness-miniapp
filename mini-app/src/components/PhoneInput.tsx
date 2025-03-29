import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { userApi } from "../services/api";
import { useTelegram } from "../context/TelegramContext";
import { useTranslation } from "react-i18next";

// Common country codes
const countryCodes = [
  { code: "+7", country: "Russia" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+81", country: "Japan" },
];

interface PhoneFormData {
  countryCode: string;
  phoneNumber: string;
}

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => void;
}

const PhoneInput = ({ onSubmit }: PhoneInputProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useTelegram();
  const { t, i18n } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>({
    defaultValues: {
      countryCode: "+7",
      phoneNumber: "",
    },
  });

  const onSubmitForm = async (data: PhoneFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;

      if (user?.id) {
        await userApi.updateProfile(user.id.toString(), fullPhoneNumber);
        setSuccess(true);
        onSubmit(fullPhoneNumber);
      } else {
        throw new Error("User ID not available");
      }
    } catch (err) {
      console.error("Error updating phone number:", err);
      setError("Failed to update phone number. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        key={`phone-title-${i18n.language}`}
      >
        {t("profile.yourPhoneNumber")}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {i18n.language === "ru"
          ? "Ваш номер нужен только для связи и не будет использован для входа или SMS."
          : "Your number is only for contact and won't be used for login or SMS."}
      </Typography>

      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {i18n.language === "ru"
            ? "Ваш номер телефона был успешно сохранен!"
            : "Your phone number has been saved successfully!"}
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="countryCode"
                control={control}
                rules={{ required: "Country code is required" }}
                render={({ field }) => (
                  <FormControl sx={{ width: "35%" }}>
                    <InputLabel id="country-code-label">
                      {i18n.language === "ru" ? "Код" : "Code"}
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="country-code-label"
                      label={i18n.language === "ru" ? "Код" : "Code"}
                      error={!!errors.countryCode}
                    >
                      {countryCodes.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.code} ({country.country})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required:
                    i18n.language === "ru"
                      ? "Требуется номер телефона"
                      : "Phone number is required",
                  pattern: {
                    value: /^[0-9]{7,15}$/,
                    message:
                      i18n.language === "ru"
                        ? "Пожалуйста, введите действительный номер телефона"
                        : "Please enter a valid phone number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("profile.phoneNumber")}
                    placeholder="9XXXXXXXXX"
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting
                ? i18n.language === "ru"
                  ? "Сохранение..."
                  : "Saving..."
                : t("profile.savePhoneNumber")}
            </Button>
          </Stack>
        </form>
      )}
    </Paper>
  );
};

export default PhoneInput;
