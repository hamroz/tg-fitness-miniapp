import { useState } from "react";
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
} from "@mui/material";
import { Exercise } from "../types/exercise";
import ExerciseTimer from "./ExerciseTimer";

interface ExerciseCardProps {
  exercise: Exercise;
  onLogWorkout: (
    exercise: Exercise,
    data: { reps?: number; sets?: number; duration?: number }
  ) => void;
}

const ExerciseCard = ({ exercise, onLogWorkout }: ExerciseCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [completed, setCompleted] = useState(false);

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

  const placeholderImage =
    "https://via.placeholder.com/300x200?text=Exercise+Image";

  return (
    <Card sx={{ maxWidth: "100%", mb: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={exercise.imageUrl || placeholderImage}
        alt={exercise.name}
      />
      <CardContent>
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
            label={exercise.category}
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
            {expanded ? "Show Less" : "Learn More"}
          </Button>

          {exercise.isTimeBased && exercise.timer && !showTimer && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleStartTimer}
            >
              Start Timer ({Math.floor(exercise.timer / 60)}:
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
              Log Workout
            </Button>
          )}
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" paragraph>
              {exercise.description}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Equipment:
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
                  Instructional Video:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  component="a"
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Video
                </Button>
              </Box>
            )}
          </Box>
        </Collapse>

        {showTimer && (
          <Box sx={{ mt: 2 }}>
            <ExerciseTimer
              initialTime={exercise.timer || 30}
              onComplete={handleCompleteTimer}
            />
            {completed && (
              <Typography
                variant="subtitle2"
                color="success.main"
                sx={{ mt: 1 }}
              >
                Great job! Workout logged.
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
