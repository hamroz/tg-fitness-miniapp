import { useState, useEffect } from "react";

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
    <div className="p-4 text-center">
      <div className="relative mb-4 inline-flex">
        <div className="relative h-32 w-32">
          <svg
            className="h-full w-full -rotate-90 transform"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(200, 200, 200, 0.2)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isActive ? "#4CAF50" : "#2481cc"}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              className="transition-all duration-300 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {!isActive ? (
          <button
            className={`rounded px-4 py-2 font-medium text-white transition-all duration-300 ease-in-out
              ${
                timeLeft === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-tg-button hover:bg-opacity-90 hover:-translate-y-0.5"
              }`}
            onClick={startTimer}
            disabled={timeLeft === 0}
          >
            {timeLeft === 0
              ? "Completed"
              : timeLeft === initialTime
              ? "Start"
              : "Resume"}
          </button>
        ) : (
          <button
            className="rounded border border-tg-button px-4 py-2 font-medium text-tg-button transition-all duration-300 ease-in-out hover:bg-tg-button hover:bg-opacity-10 hover:-translate-y-0.5"
            onClick={pauseTimer}
          >
            Pause
          </button>
        )}

        <button
          className={`rounded border border-accent px-4 py-2 font-medium text-accent transition-all duration-300 ease-in-out
            ${
              timeLeft === initialTime
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-accent hover:bg-opacity-10 hover:-translate-y-0.5"
            }`}
          onClick={resetTimer}
          disabled={timeLeft === initialTime}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ExerciseTimer;
