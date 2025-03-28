import { Exercise } from "../types/exercise";

export const mockExercises: Exercise[] = [
  {
    _id: "1",
    name: "Push-ups",
    description:
      "A classic bodyweight exercise that strengthens the chest, shoulders, triceps, and core. Keep your body in a straight line from head to toe.",
    category: "strength",
    muscleGroup: ["chest", "shoulders", "triceps", "core"],
    equipment: ["none"],
    isTimeBased: false,
  },
  {
    _id: "2",
    name: "Plank",
    description:
      "An isometric core exercise that involves maintaining a position similar to a push-up for the maximum possible time. Strengthens the abdominals, back, and shoulders.",
    category: "strength",
    muscleGroup: ["core", "shoulders"],
    equipment: ["none"],
    timer: 30,
    isTimeBased: true,
  },
  {
    _id: "3",
    name: "Squats",
    description:
      "A compound exercise that targets the quadriceps, hamstrings, and glutes. Keep your back straight and knees in line with your toes.",
    category: "strength",
    muscleGroup: ["quadriceps", "hamstrings", "glutes"],
    equipment: ["none"],
    isTimeBased: false,
  },
  {
    _id: "4",
    name: "Jumping Jacks",
    description:
      "A full-body cardiovascular exercise that involves jumping while moving your arms and legs in and out.",
    category: "cardio",
    muscleGroup: ["full body"],
    equipment: ["none"],
    timer: 60,
    isTimeBased: true,
  },
  {
    _id: "5",
    name: "Burpees",
    description:
      "A full-body exercise that combines a squat, push-up, and jump. Great for building strength and endurance.",
    category: "cardio",
    muscleGroup: ["full body"],
    equipment: ["none"],
    isTimeBased: false,
  },
  {
    _id: "6",
    name: "Lunges",
    description:
      "A lower body exercise that targets the quadriceps, hamstrings, and glutes while also engaging your core for stability.",
    category: "strength",
    muscleGroup: ["quadriceps", "hamstrings", "glutes", "core"],
    equipment: ["none"],
    isTimeBased: false,
  },
  {
    _id: "7",
    name: "Mountain Climbers",
    description:
      "A dynamic plank exercise that works your core, shoulders, and legs while raising your heart rate.",
    category: "cardio",
    muscleGroup: ["core", "shoulders", "legs"],
    equipment: ["none"],
    timer: 45,
    isTimeBased: true,
  },
  {
    _id: "8",
    name: "Downward Dog",
    description:
      "A yoga pose that stretches the hamstrings, calves, and shoulders while strengthening the arms and legs.",
    category: "flexibility",
    muscleGroup: ["hamstrings", "shoulders", "arms", "legs"],
    equipment: ["yoga mat"],
    isTimeBased: false,
  },
  {
    _id: "9",
    name: "Bicycle Crunches",
    description:
      "A core exercise that targets the rectus abdominis and the obliques by simulating a pedaling motion.",
    category: "strength",
    muscleGroup: ["core", "obliques"],
    equipment: ["none"],
    isTimeBased: false,
  },
  {
    _id: "10",
    name: "Tree Pose",
    description:
      "A standing yoga pose that improves balance, focus, and stability while strengthening the legs and core.",
    category: "balance",
    muscleGroup: ["legs", "core"],
    equipment: ["none"],
    timer: 30,
    isTimeBased: true,
  },
];
