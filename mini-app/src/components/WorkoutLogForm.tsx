import { useState } from "react";
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
          className="inline-block w-full max-w-md p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-paper rounded-xl shadow-xl animate-scale-in sm:align-middle"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">Log Workout</h3>
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
            <p className="mt-1 text-sm text-text-secondary">{exercise.name}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="p-5">
              <div className="space-y-5">
                {error && (
                  <div className="p-3 flex items-center bg-error-color/10 text-error-color border border-error-color/20 rounded-lg animate-fade-in">
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

                <div className="grid grid-cols-2 gap-4">
                  {!exercise.isTimeBased && (
                    <>
                      <div className="space-y-2">
                        <Controller
                          name="sets"
                          control={control}
                          rules={{ min: 1, max: 10 }}
                          render={({ field }) => (
                            <div>
                              <div className="flex justify-between mb-1.5">
                                <label className="block text-sm font-medium text-text-secondary">
                                  Sets
                                </label>
                                <span className="text-sm font-medium text-accent">
                                  {field.value}
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                {...field}
                                className="w-full h-2 bg-border/30 rounded-lg appearance-none cursor-pointer accent-accent"
                              />
                              <div className="flex justify-between text-xs mt-1 text-text-secondary">
                                <span>1</span>
                                <span>5</span>
                                <span>10</span>
                              </div>
                            </div>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Controller
                          name="reps"
                          control={control}
                          rules={{ min: 1, max: 100 }}
                          render={({ field }) => (
                            <div>
                              <div className="flex justify-between mb-1.5">
                                <label className="block text-sm font-medium text-text-secondary">
                                  Reps
                                </label>
                                <span className="text-sm font-medium text-accent">
                                  {field.value}
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="50"
                                step="1"
                                {...field}
                                className="w-full h-2 bg-border/30 rounded-lg appearance-none cursor-pointer accent-accent"
                              />
                              <div className="flex justify-between text-xs mt-1 text-text-secondary">
                                <span>1</span>
                                <span>25</span>
                                <span>50</span>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {exercise.isTimeBased && (
                    <div className="col-span-2">
                      <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                              Duration
                            </label>
                            <div className="flex">
                              <input
                                {...field}
                                type="number"
                                disabled={true}
                                className="w-full px-3 py-2.5 border border-border rounded-lg bg-paper/50 text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                              />
                              <div className="ml-2 flex items-center text-text-secondary">
                                seconds
                              </div>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  )}

                  <div className="col-span-2">
                    <Controller
                      name="weight"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Weight (optional)
                          </label>
                          <div className="flex">
                            <input
                              {...field}
                              type="number"
                              min="0"
                              step="0.5"
                              className="w-full px-3 py-2.5 border border-border rounded-lg bg-paper text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                            />
                            <div className="ml-2 flex items-center text-text-secondary">
                              kg
                            </div>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <Controller
                      name="notes"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Notes (optional)
                          </label>
                          <textarea
                            {...field}
                            rows={2}
                            placeholder="How did it feel? Any challenges?"
                            className="w-full px-3 py-2.5 border border-border rounded-lg bg-paper text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all resize-none"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-bg/50 border-t border-border flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-border/20 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg font-medium text-white flex items-center
                  ${
                    isSubmitting
                      ? "bg-accent/60 cursor-not-allowed"
                      : "bg-accent hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0"
                  } 
                  transition-all`}
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
                    Saving...
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
                    Log Workout
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogForm;
