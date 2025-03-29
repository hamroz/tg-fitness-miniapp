import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { userApi } from "../services/api";
import { useTelegram } from "../context/TelegramContext";

interface IndividualPlanFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  goals: string;
  weight: number;
  height: number;
  fitnessLevel: string;
  healthIssues: string;
  preferredWorkoutDays: string[];
  preferredWorkoutTime: string;
}

const fitnessLevels = [
  { value: "beginner", label: "Beginner (new to fitness)" },
  {
    value: "intermediate",
    label: "Intermediate (work out 1-3 times per week)",
  },
  { value: "advanced", label: "Advanced (work out 3+ times per week)" },
  { value: "athlete", label: "Athlete (competitive training)" },
];

const weekdays = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const workoutTimes = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "flexible", label: "Flexible" },
];

const IndividualPlanForm = ({
  open,
  onClose,
  onSuccess,
}: IndividualPlanFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useTelegram();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      goals: "",
      weight: 70,
      height: 170,
      fitnessLevel: "beginner",
      healthIssues: "",
      preferredWorkoutDays: ["monday", "wednesday", "friday"],
      preferredWorkoutTime: "evening",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      setError(null);

      if (!user?.id) {
        throw new Error("User ID not available");
      }

      // Submit data to backend
      await userApi.submitIndividualPlanInfo(user.id.toString(), data);

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error submitting individual plan data:", err);
      setError("Failed to submit information. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block w-full max-w-3xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-paper rounded-xl shadow-xl animate-scale-in sm:align-middle"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">
                Individual Plan Information
              </h3>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text focus:outline-none transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-5">
            <p className="text-sm text-text-secondary mb-5">
              Please provide additional information to help us create your
              personalized fitness plan. Our coaches will review your
              information and contact you within 24 hours.
            </p>

            {error && (
              <div className="p-3 mb-5 flex items-center bg-error-color/10 text-error-color border border-error-color/20 rounded-lg animate-fade-in">
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

            <form
              id="individual-plan-form"
              onSubmit={handleSubmit(onSubmit)}
              className="animate-slide-up"
            >
              <div className="space-y-5">
                <Controller
                  name="goals"
                  control={control}
                  rules={{ required: "Please describe your fitness goals" }}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Fitness Goals
                      </label>
                      <textarea
                        {...field}
                        rows={3}
                        placeholder="Describe your fitness goals in detail (e.g., lose weight, build muscle, improve endurance, etc.)"
                        className={`w-full px-3 py-2.5 border rounded-lg bg-paper text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all
                        ${
                          errors.goals ? "border-error-color" : "border-border"
                        }`}
                      />
                      {errors.goals && (
                        <p className="mt-1 text-xs text-error-color">
                          {errors.goals.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="weight"
                    control={control}
                    rules={{
                      required: "Weight is required",
                      min: {
                        value: 30,
                        message: "Weight must be at least 30 kg",
                      },
                      max: {
                        value: 250,
                        message: "Weight must be less than 250 kg",
                      },
                    }}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                          Weight
                        </label>
                        <div className="flex">
                          <input
                            {...field}
                            type="number"
                            className={`w-full px-3 py-2.5 border rounded-lg bg-paper text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all
                            ${
                              errors.weight
                                ? "border-error-color"
                                : "border-border"
                            }`}
                          />
                          <div className="ml-2 flex items-center text-text-secondary">
                            kg
                          </div>
                        </div>
                        {errors.weight && (
                          <p className="mt-1 text-xs text-error-color">
                            {errors.weight.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="height"
                    control={control}
                    rules={{
                      required: "Height is required",
                      min: {
                        value: 100,
                        message: "Height must be at least 100 cm",
                      },
                      max: {
                        value: 250,
                        message: "Height must be less than 250 cm",
                      },
                    }}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                          Height
                        </label>
                        <div className="flex">
                          <input
                            {...field}
                            type="number"
                            className={`w-full px-3 py-2.5 border rounded-lg bg-paper text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all
                            ${
                              errors.height
                                ? "border-error-color"
                                : "border-border"
                            }`}
                          />
                          <div className="ml-2 flex items-center text-text-secondary">
                            cm
                          </div>
                        </div>
                        {errors.height && (
                          <p className="mt-1 text-xs text-error-color">
                            {errors.height.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Controller
                  name="fitnessLevel"
                  control={control}
                  rules={{ required: "Please select your fitness level" }}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Fitness Level
                      </label>
                      <div className="relative">
                        <select
                          {...field}
                          className={`w-full pl-3 pr-8 py-2.5 appearance-none border rounded-lg bg-paper text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all
                          ${
                            errors.fitnessLevel
                              ? "border-error-color"
                              : "border-border"
                          }`}
                        >
                          {fitnessLevels.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
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
                      {errors.fitnessLevel && (
                        <p className="mt-1 text-xs text-error-color">
                          {errors.fitnessLevel.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="healthIssues"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Health Issues or Limitations (Optional)
                      </label>
                      <textarea
                        {...field}
                        rows={2}
                        placeholder="Describe any health issues, injuries, or limitations that may affect your workouts"
                        className="w-full px-3 py-2.5 border border-border rounded-lg bg-paper text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                      />
                    </div>
                  )}
                />

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Preferred Workout Days
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Controller
                      name="preferredWorkoutDays"
                      control={control}
                      rules={{ required: "Select at least one day" }}
                      render={({ field }) => (
                        <>
                          {weekdays.map((day) => (
                            <label
                              key={day.value}
                              className={`flex items-center p-2.5 rounded-lg border transition-all cursor-pointer
                              ${
                                field.value.includes(day.value)
                                  ? "border-accent bg-accent/5 text-text"
                                  : "border-border text-text-secondary hover:bg-bg"
                              }`}
                            >
                              <input
                                type="checkbox"
                                value={day.value}
                                checked={field.value.includes(day.value)}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const newValues = e.target.checked
                                    ? [...field.value, value]
                                    : field.value.filter(
                                        (day) => day !== value
                                      );
                                  field.onChange(newValues);
                                }}
                                className="sr-only"
                              />
                              <span className="flex items-center">
                                <svg
                                  className={`h-4 w-4 mr-2 transition-transform ${
                                    field.value.includes(day.value)
                                      ? "text-accent"
                                      : "text-border"
                                  }`}
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
                                {day.label}
                              </span>
                            </label>
                          ))}
                        </>
                      )}
                    />
                  </div>
                  {errors.preferredWorkoutDays && (
                    <p className="mt-1.5 text-xs text-error-color">
                      {errors.preferredWorkoutDays.message}
                    </p>
                  )}
                </div>

                <Controller
                  name="preferredWorkoutTime"
                  control={control}
                  rules={{ required: "Please select a preferred time" }}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Preferred Workout Time
                      </label>
                      <div className="relative">
                        <select
                          {...field}
                          className={`w-full pl-3 pr-8 py-2.5 appearance-none border rounded-lg bg-paper text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all
                          ${
                            errors.preferredWorkoutTime
                              ? "border-error-color"
                              : "border-border"
                          }`}
                        >
                          {workoutTimes.map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.label}
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
                      {errors.preferredWorkoutTime && (
                        <p className="mt-1 text-xs text-error-color">
                          {errors.preferredWorkoutTime.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </form>
          </div>

          <div className="p-4 bg-bg/50 border-t border-border flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-border rounded-lg text-text-secondary hover:bg-border/20 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="individual-plan-form"
              disabled={submitting}
              className={`px-4 py-2.5 rounded-lg font-medium text-white flex items-center
                ${
                  submitting
                    ? "bg-accent/60 cursor-not-allowed"
                    : "bg-accent hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0"
                } transition-all`}
            >
              {submitting ? (
                <span className="flex items-center">
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
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center">
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
                  Submit
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualPlanForm;
