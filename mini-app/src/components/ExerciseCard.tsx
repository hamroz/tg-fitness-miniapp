import { useState, Suspense, lazy } from "react";
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

// Extend the Exercise type with optional fields that might be added later
interface ExtendedExercise extends Exercise {
  instructions?: string[];
  tips?: string[];
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

  // Cast exercise to ExtendedExercise to handle optional fields
  const extendedExercise = exercise as ExtendedExercise;

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

  return (
    <div className="w-full mb-6 overflow-hidden bg-paper rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in">
      <div className="relative">
        {isPremium && (
          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 text-xs font-medium bg-accent/80 text-white rounded-full backdrop-blur-sm">
            {t("subscription.premiumPlan")}
          </span>
        )}

        {isPremium && !hasAccess && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-gray-900/70 z-10 p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-white text-lg font-semibold mb-2">
              {t("subscription.premiumFeatures")}
            </h3>
            <p className="text-white/80 text-sm mb-4">
              {t("subscription.lockedContent")}
            </p>
            <a
              href="/subscription"
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 hover:-translate-y-0.5 transition-all duration-300"
            >
              {t("subscription.viewPlans")}
            </a>
          </div>
        )}

        {!imageLoaded && (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 animate-pulse" />
        )}

        <div className="h-48 overflow-hidden">
          <img
            src={exercise.imageUrl || placeholderImage}
            alt={exercise.name}
            className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
              !hasAccess ? "blur-sm opacity-70" : ""
            } ${imageLoaded ? "block" : "hidden"}`}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        </div>
      </div>

      <div
        className={`p-5 ${
          !hasAccess ? "blur-sm opacity-70 pointer-events-none" : ""
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-semibold text-text">{exercise.name}</h2>
          <span className="px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-md">
            {t(`exercises.${exercise.category}`)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {exercise.muscleGroup.map((muscle) => (
            <span
              key={muscle}
              className="px-2 py-0.5 text-xs font-medium text-text-secondary bg-border/30 rounded-md"
            >
              {muscle}
            </span>
          ))}
        </div>

        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {exercise.description}
        </p>

        <div className="flex justify-between items-center">
          <button
            onClick={handleExpandClick}
            className="text-sm text-accent hover:text-accent/80 hover:underline focus:outline-none transition-colors"
            aria-expanded={expanded}
          >
            {expanded ? t("common.back") : t("exercises.viewDetails")}
          </button>

          {!expanded && (
            <div className="flex space-x-2">
              {exercise.isTimeBased && exercise.timer && !showTimer && (
                <button
                  onClick={handleStartTimer}
                  className="px-3 py-1.5 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {Math.floor(exercise.timer / 60)}:
                    {(exercise.timer % 60).toString().padStart(2, "0")}
                  </span>
                </button>
              )}

              {!exercise.isTimeBased && (
                <button
                  onClick={() => onLogWorkout(exercise, { reps: 10, sets: 3 })}
                  className="px-3 py-1.5 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t("workout.logWorkout")}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {expanded && (
          <div className="mt-4 animate-slide-up">
            <p className="text-sm text-text-secondary mb-5">
              {exercise.description}
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-text">
                  {t("exercises.equipment")}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.equipment.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 text-xs font-medium text-text-secondary bg-border/30 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {extendedExercise.instructions &&
                extendedExercise.instructions.length > 0 && (
                  <div className="p-4 bg-bg rounded-lg">
                    <h3 className="text-sm font-semibold mb-2 text-text">
                      {t("exercises.instructions")}
                    </h3>
                    <ol className="list-decimal list-inside text-sm space-y-2 text-text-secondary">
                      {extendedExercise.instructions.map(
                        (step: string, index: number) => (
                          <li key={index} className="pl-1">
                            {step}
                          </li>
                        )
                      )}
                    </ol>
                  </div>
                )}

              {extendedExercise.tips && extendedExercise.tips.length > 0 && (
                <div className="p-4 bg-accent/5 rounded-lg border-l-2 border-accent">
                  <h3 className="text-sm font-semibold mb-2 text-accent">
                    {t("exercises.tips")}
                  </h3>
                  <ul className="text-sm space-y-2 text-text-secondary">
                    {extendedExercise.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-accent inline-block mr-2 mt-1">
                          •
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {showTimer && (
          <div className="mt-6 animate-slide-up">
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-32">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              }
            >
              <ExerciseTimer
                initialTime={exercise.timer || 60}
                onComplete={handleCompleteTimer}
              />
            </Suspense>
            {completed && (
              <div className="mt-4 p-3 flex items-center bg-success-color/10 text-success-color border border-success-color/20 rounded-lg animate-fade-in">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
                  {t("workout.completed")}! {t("workout.logged")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;
