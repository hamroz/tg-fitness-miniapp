import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";

interface ExerciseTimerProps {
  initialTime: number;
  onComplete?: () => void;
}

const ExerciseTimer = ({ initialTime, onComplete }: ExerciseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, onComplete]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  // Calculate progress percentage for the circular indicator
  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={120}
          thickness={4}
          sx={{ color: isActive ? "success.main" : "primary.main" }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" component="div" color="text.primary">
            {formatTime(timeLeft)}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center">
        {!isActive ? (
          <Button
            variant="contained"
            color="primary"
            onClick={startTimer}
            disabled={timeLeft === 0}
          >
            {timeLeft === 0
              ? "Completed"
              : timeLeft === initialTime
              ? "Start"
              : "Resume"}
          </Button>
        ) : (
          <Button variant="outlined" color="primary" onClick={pauseTimer}>
            Pause
          </Button>
        )}

        <Button
          variant="outlined"
          color="secondary"
          onClick={resetTimer}
          disabled={timeLeft === initialTime}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
};

export default ExerciseTimer;
