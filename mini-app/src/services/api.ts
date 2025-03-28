import axios from "axios";
import { Exercise, WorkoutLog } from "../types/exercise";

// In a real app, this would come from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Telegram auth data to all requests
api.interceptors.request.use((config) => {
  if (window.Telegram?.WebApp) {
    config.headers["Telegram-Data"] = window.Telegram.WebApp.initData;
  }
  return config;
});

export const exerciseApi = {
  // Get all exercises
  getExercises: async () => {
    const response = await api.get<Exercise[]>("/exercises");
    return response.data;
  },

  // Get exercises by category
  getExercisesByCategory: async (category: string) => {
    const response = await api.get<Exercise[]>(
      `/exercises/category/${category}`
    );
    return response.data;
  },

  // Get a single exercise by ID
  getExercise: async (id: string) => {
    const response = await api.get<Exercise>(`/exercises/${id}`);
    return response.data;
  },
};

export const workoutApi = {
  // Log a workout
  logWorkout: async (workoutData: Omit<WorkoutLog, "_id">) => {
    const response = await api.post<WorkoutLog>("/workouts", workoutData);
    return response.data;
  },

  // Get user's workout history
  getWorkoutHistory: async (userId: string) => {
    const response = await api.get<WorkoutLog[]>(`/workouts/user/${userId}`);
    return response.data;
  },

  // Get workout history for a specific date
  getWorkoutsByDate: async (userId: string, date: string) => {
    const response = await api.get<WorkoutLog[]>(
      `/workouts/user/${userId}/date/${date}`
    );
    return response.data;
  },

  // Update a workout log
  updateWorkout: async (id: string, workoutData: Partial<WorkoutLog>) => {
    const response = await api.put<WorkoutLog>(`/workouts/${id}`, workoutData);
    return response.data;
  },

  // Delete a workout log
  deleteWorkout: async (id: string) => {
    await api.delete(`/workouts/${id}`);
    return true;
  },
};

export const userApi = {
  // Update user profile with phone number
  updateProfile: async (userId: string, phoneNumber: string) => {
    const response = await api.put(`/users/${userId}/phone`, {
      phone: phoneNumber,
    });
    return response.data;
  },

  // Get user data
  getUserData: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

export default api;
