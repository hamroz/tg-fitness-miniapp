import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  Alert,
  Grid,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Individual Plan Information</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please provide additional information to help us create your
          personalized fitness plan. Our coaches will review your information
          and contact you within 24 hours.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form id="individual-plan-form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Controller
              name="goals"
              control={control}
              rules={{ required: "Please describe your fitness goals" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fitness Goals"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Describe your fitness goals in detail (e.g., lose weight, build muscle, improve endurance, etc.)"
                  error={!!errors.goals}
                  helperText={errors.goals?.message}
                />
              )}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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
                    <TextField
                      {...field}
                      type="number"
                      label="Weight"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">kg</InputAdornment>
                        ),
                      }}
                      error={!!errors.weight}
                      helperText={errors.weight?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                    <TextField
                      {...field}
                      type="number"
                      label="Height"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">cm</InputAdornment>
                        ),
                      }}
                      error={!!errors.height}
                      helperText={errors.height?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Controller
              name="fitnessLevel"
              control={control}
              rules={{ required: "Please select your fitness level" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.fitnessLevel}>
                  <InputLabel>Fitness Level</InputLabel>
                  <Select {...field} label="Fitness Level">
                    {fitnessLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="healthIssues"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Health Issues or Limitations (Optional)"
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="Any injuries, conditions, or limitations we should be aware of"
                />
              )}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Preferred Workout Days
              </Typography>
              <Controller
                name="preferredWorkoutDays"
                control={control}
                rules={{ required: "Please select at least one workout day" }}
                render={({ field }) => (
                  <FormGroup>
                    <Grid container spacing={1}>
                      {weekdays.map((day) => (
                        <Grid item xs={6} sm={4} key={day.value}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value.includes(day.value)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, day.value]
                                    : field.value.filter(
                                        (d) => d !== day.value
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={day.label}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                )}
              />
              {errors.preferredWorkoutDays && (
                <Typography color="error" variant="caption">
                  {errors.preferredWorkoutDays.message}
                </Typography>
              )}
            </Box>

            <Controller
              name="preferredWorkoutTime"
              control={control}
              rules={{ required: "Please select your preferred workout time" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.preferredWorkoutTime}>
                  <InputLabel>Preferred Workout Time</InputLabel>
                  <Select {...field} label="Preferred Workout Time">
                    {workoutTimes.map((time) => (
                      <MenuItem key={time.value} value={time.value}>
                        {time.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Stack>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="individual-plan-form"
          variant="contained"
          color="primary"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IndividualPlanForm;
