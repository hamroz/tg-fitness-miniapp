import { useState } from "react";
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
    <div className="p-6 max-w-md mx-auto mt-6 bg-paper rounded-xl shadow-sm animate-scale-in">
      <h2
        className="text-xl font-semibold mb-2 text-text"
        key={`phone-title-${i18n.language}`}
      >
        {t("profile.yourPhoneNumber")}
      </h2>

      <p className="text-sm text-text-secondary mb-6">
        {i18n.language === "ru"
          ? "Ваш номер нужен только для связи и не будет использован для входа или SMS."
          : "Your number is only for contact and won't be used for login or SMS."}
      </p>

      {success ? (
        <div className="p-4 flex items-center bg-success-color/10 text-success-color border border-success-color/20 rounded-lg animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {i18n.language === "ru"
              ? "Ваш номер телефона был успешно сохранен!"
              : "Your phone number has been saved successfully!"}
          </span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="animate-slide-up"
        >
          <div className="space-y-6">
            {error && (
              <div className="p-4 flex items-center bg-error-color/10 text-error-color border border-error-color/20 rounded-lg animate-fade-in">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Controller
                name="countryCode"
                control={control}
                rules={{ required: "Country code is required" }}
                render={({ field }) => (
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      {i18n.language === "ru" ? "Код" : "Code"}
                    </label>
                    <div className="relative">
                      <select
                        {...field}
                        className={`w-full pl-3 pr-8 py-2.5 appearance-none border rounded-lg bg-paper text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all
                        ${
                          errors.countryCode
                            ? "border-error-color"
                            : "border-border"
                        }`}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.code}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                          className="h-4 w-4 text-text-secondary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.countryCode && (
                      <p className="mt-1 text-xs text-error-color">
                        {errors.countryCode.message}
                      </p>
                    )}
                  </div>
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
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      {t("profile.phoneNumber")}
                    </label>
                    <input
                      {...field}
                      type="text"
                      placeholder="9XXXXXXXXX"
                      className={`w-full px-3 py-2.5 border rounded-lg bg-paper text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all
                      ${
                        errors.phoneNumber
                          ? "border-error-color"
                          : "border-border"
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-xs text-error-color">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center items-center py-2.5 px-4 rounded-lg font-medium text-white transition-all
              ${
                isSubmitting
                  ? "bg-accent/60 cursor-not-allowed"
                  : "bg-accent hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {i18n.language === "ru" ? "Сохранение..." : "Saving..."}
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("profile.savePhoneNumber")}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PhoneInput;
