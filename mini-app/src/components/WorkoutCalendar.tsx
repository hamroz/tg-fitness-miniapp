import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  styled,
} from "@mui/material";
import { WorkoutLog } from "../types/exercise";
import { workoutApi } from "../services/api";
import { useTelegram } from "../context/TelegramContext";
import { useTranslation } from "react-i18next";

// Custom styled Calendar
const StyledCalendar = styled(Calendar)(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  backgroundColor: "var(--bg-color)",
  color: "var(--text-color)",
  borderRadius: theme.shape.borderRadius,
  border: "none",
  padding: theme.spacing(2),
  "& .react-calendar__tile--active": {
    background: "var(--button-color)",
    color: "var(--button-text-color)",
  },
  "& .react-calendar__tile--now": {
    backgroundColor: theme.palette.action.selected,
  },
  "& .workout-day": {
    backgroundColor: theme.palette.success.light,
    borderRadius: "50%",
    color: theme.palette.success.contrastText,
  },
}));

const WorkoutCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [workoutDates, setWorkoutDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useTelegram();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (user?.id) {
      loadWorkoutHistory();
    }
  }, [user, i18n.language]);

  const loadWorkoutHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error("User ID not available");
      }

      const workoutHistory = await workoutApi.getWorkoutHistory(
        user.id.toString()
      );
      setWorkouts(workoutHistory);

      // Extract unique dates for highlighting on calendar
      const dates = workoutHistory.map((workout) => new Date(workout.date));
      const uniqueDates = Array.from(
        new Set(dates.map((date) => date.toDateString()))
      ).map((dateStr) => new Date(dateStr));

      setWorkoutDates(uniqueDates);
    } catch (err) {
      console.error("Error loading workout history:", err);
      setError("Failed to load workout history");
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkoutsForDate = async (selectedDate: Date) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error("User ID not available");
      }

      const dateString = selectedDate.toISOString().split("T")[0];
      const workoutsForDate = await workoutApi.getWorkoutsByDate(
        user.id.toString(),
        dateString
      );
      setWorkouts(workoutsForDate);
    } catch (err) {
      console.error("Error loading workouts for date:", err);
      setError("Failed to load workouts for the selected date");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    loadWorkoutsForDate(newDate);
  };

  // Function to add custom class to tiles with workouts
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      return workoutDates.some(
        (workoutDate) =>
          workoutDate.getDate() === date.getDate() &&
          workoutDate.getMonth() === date.getMonth() &&
          workoutDate.getFullYear() === date.getFullYear()
      )
        ? "workout-day"
        : null;
    }
    return null;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    if (i18n.language === "ru") {
      const weekdays = t("calendar.weekdays", {
        returnObjects: true,
      }) as string[];
      const months = t("calendar.months", { returnObjects: true }) as string[];

      const weekday = weekdays[date.getDay()];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      return `${weekday}, ${day} ${month} ${year}`;
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <StyledCalendar
          onChange={handleDateChange}
          value={date}
          tileClassName={tileClassName}
          locale={i18n.language}
          prevLabel="<"
          nextLabel=">"
          prev2Label="<<"
          next2Label=">>"
          navigationLabel={({ date, label, locale, view }) => {
            if (i18n.language === "ru") {
              const months = t("calendar.months", {
                returnObjects: true,
              }) as string[];
              const month = months[date.getMonth()];
              return `${month} ${date.getFullYear()}`;
            }
            return label;
          }}
          formatShortWeekday={(locale, date) => {
            if (i18n.language === "ru") {
              const weekdaysShort = t("calendar.weekdaysShort", {
                returnObjects: true,
              }) as string[];
              return weekdaysShort[date.getDay()];
            }
            return date.toLocaleDateString(locale, { weekday: "short" });
          }}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom key={i18n.language}>
          {t("calendar.workoutsOn")} {formatDate(date)}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : workouts.length === 0 ? (
          <Alert severity="info" key={i18n.language}>
            {t("calendar.noWorkoutsFound")}
          </Alert>
        ) : (
          <List>
            {workouts.map((workout, index) => (
              <Box key={workout._id || index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={workout.exerciseName}
                    secondary={
                      <Box component="span">
                        {workout.sets && `${workout.sets} sets × `}
                        {workout.reps && `${workout.reps} reps`}
                        {workout.duration && `Duration: ${workout.duration}s`}
                        {workout.weight > 0 && ` • Weight: ${workout.weight}kg`}
                        {workout.notes && (
                          <Typography
                            component="p"
                            variant="body2"
                            sx={{ mt: 1, fontStyle: "italic" }}
                          >
                            "{workout.notes}"
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < workouts.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default WorkoutCalendar;
