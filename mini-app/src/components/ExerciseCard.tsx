import { useState, Suspense, lazy } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Collapse,
  Stack,
  Tooltip,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Exercise } from "../types/exercise";
import { useTranslation } from "react-i18next";

// Lazy load the ExerciseTimer component
const ExerciseTimer = lazy(() => import("./ExerciseTimer"));

interface ExerciseCardProps {
  exercise: Exercise;
  onLogWorkout: (
    exercise: Exercise,
    data: { reps?: number; sets?: number; duration?: number }
  ) => void;
  isPremium?: boolean;
  userSubscription?: string;
}

const ExerciseCard = ({
  exercise,
  onLogWorkout,
  isPremium = false,
  userSubscription = "free",
}: ExerciseCardProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleStartTimer = () => {
    setShowTimer(true);
  };

  const handleCompleteTimer = () => {
    setCompleted(true);
    onLogWorkout(exercise, { duration: exercise.timer });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const placeholderImage =
    "https://via.placeholder.com/300x200?text=Exercise+Image";

  // Check if user has access to this exercise
  const hasAccess =
    !isPremium ||
    userSubscription === "premium" ||
    userSubscription === "individual";

  // Apply blur effect for premium exercises that user doesn't have access to
  const blurStyle = !hasAccess
    ? {
        filter: "blur(5px)",
        opacity: 0.7,
        pointerEvents: "none" as const,
      }
    : {};

  return (
    <Card sx={{ maxWidth: "100%", mb: 2, position: "relative" }}>
      {isPremium && (
        <Chip
          label={t("subscription.premiumPlan")}
          color="secondary"
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 2,
          }}
        />
      )}

      {isPremium && !hasAccess && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1,
            p: 3,
            textAlign: "center",
          }}
        >
          <LockIcon sx={{ fontSize: 48, color: "white", mb: 2 }} />
          <Typography color="white" variant="h6" gutterBottom>
            {t("subscription.premiumFeatures")}
          </Typography>
          <Typography color="white" variant="body2" sx={{ mb: 2 }}>
            {t("subscription.lockedContent")}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component="a"
            href="/subscription"
          >
            {t("subscription.viewPlans")}
          </Button>
        </Box>
      )}

      {!imageLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          animation="wave"
        />
      )}

      <CardMedia
        component="img"
        height="200"
        image={exercise.imageUrl || placeholderImage}
        alt={exercise.name}
        sx={{
          ...blurStyle,
          display: imageLoaded ? "block" : "none",
        }}
        onLoad={handleImageLoad}
        loading="lazy"
      />

      <CardContent sx={blurStyle}>
        <Typography gutterBottom variant="h5" component="div">
          {exercise.name}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 1 }}
        >
          <Chip
            label={t(`exercises.${exercise.category}`)}
            color="primary"
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
          {exercise.muscleGroup.map((muscle) => (
            <Chip
              key={muscle}
              label={muscle}
              variant="outlined"
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {exercise.description.length > 120
            ? `${exercise.description.substring(0, 120)}...`
            : exercise.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Button size="small" onClick={handleExpandClick}>
            {expanded ? t("common.back") : t("exercises.viewDetails")}
          </Button>

          {exercise.isTimeBased && exercise.timer && !showTimer && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleStartTimer}
            >
              {t("workout.startTimer")} ({Math.floor(exercise.timer / 60)}:
              {(exercise.timer % 60).toString().padStart(2, "0")})
            </Button>
          )}

          {!exercise.isTimeBased && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => onLogWorkout(exercise, { reps: 10, sets: 3 })}
            >
              {t("workout.logWorkout")}
            </Button>
          )}
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" paragraph>
              {exercise.description}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              {t("exercises.equipment")}:
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ mb: 2 }}
            >
              {exercise.equipment.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Stack>

            {exercise.videoUrl && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t("exercises.instructionalVideo")}:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  component="a"
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("exercises.watchVideo")}
                </Button>
              </Box>
            )}
          </Box>
        </Collapse>

        {showTimer && (
          <Box sx={{ mt: 2 }}>
            <Suspense
              fallback={
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              }
            >
              <ExerciseTimer
                initialTime={exercise.timer || 30}
                onComplete={handleCompleteTimer}
              />
            </Suspense>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
