import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  Grid,
  Slider,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Exercise, WorkoutLog } from "../types/exercise";
import { workoutApi } from "../services/api";
import { useTelegram } from "../context/TelegramContext";

interface WorkoutFormData {
  reps?: number;
  sets?: number;
  weight?: number;
  duration?: number;
  notes: string;
}

interface WorkoutLogFormProps {
  exercise: Exercise;
  open: boolean;
  onClose: () => void;
  onSuccess: (log: WorkoutLog) => void;
}

const WorkoutLogForm = ({
  exercise,
  open,
  onClose,
  onSuccess,
}: WorkoutLogFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useTelegram();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkoutFormData>({
    defaultValues: {
      reps: exercise.isTimeBased ? undefined : 10,
      sets: exercise.isTimeBased ? undefined : 3,
      weight: 0,
      duration: exercise.isTimeBased ? exercise.timer : undefined,
      notes: "",
    },
  });

  const onSubmitForm = async (data: WorkoutFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!user?.id) {
        throw new Error("User ID not available");
      }

      const workoutData: Omit<WorkoutLog, "_id"> = {
        userId: user.id.toString(),
        exerciseId: exercise._id,
        exerciseName: exercise.name,
        date: new Date().toISOString(),
        ...data,
      };

      const savedWorkout = await workoutApi.logWorkout(workoutData);
      reset();
      onSuccess(savedWorkout);
      onClose();
    } catch (err) {
      console.error("Error logging workout:", err);
      setError("Failed to log workout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Log Workout: {exercise.name}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={2}>
              {!exercise.isTimeBased && (
                <>
                  <Grid item xs={6}>
                    <Controller
                      name="sets"
                      control={control}
                      rules={{ min: 1, max: 10 }}
                      render={({ field }) => (
                        <Box>
                          <Typography gutterBottom>
                            Sets: {field.value}
                          </Typography>
                          <Slider
                            {...field}
                            min={1}
                            max={10}
                            step={1}
                            marks
                            valueLabelDisplay="auto"
                            onChange={(_, value) => field.onChange(value)}
                          />
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      name="reps"
                      control={control}
                      rules={{ min: 1, max: 100 }}
                      render={({ field }) => (
                        <Box>
                          <Typography gutterBottom>
                            Reps: {field.value}
                          </Typography>
                          <Slider
                            {...field}
                            min={1}
                            max={50}
                            step={1}
                            marks={[
                              { value: 1, label: "1" },
                              { value: 25, label: "25" },
                              { value: 50, label: "50" },
                            ]}
                            valueLabelDisplay="auto"
                            onChange={(_, value) => field.onChange(value)}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                </>
              )}

              {exercise.isTimeBased && (
                <Grid item xs={12}>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Duration"
                        type="number"
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              seconds
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{ min: 1 }}
                        disabled={true}
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Weight (optional)"
                      type="number"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">kg</InputAdornment>
                        ),
                      }}
                      inputProps={{ min: 0, step: 0.5 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes (optional)"
                      multiline
                      rows={2}
                      fullWidth
                      placeholder="How did it feel? Any challenges?"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Log Workout"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WorkoutLogForm;
