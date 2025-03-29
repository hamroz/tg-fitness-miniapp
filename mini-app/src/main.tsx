import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./assets/fonts.css"; // Import Open Sans font
import { mockExercises } from "./data/mockExercises.ts";
// Import i18n config
import "./i18n/i18n";

// Setup mock API handlers for development
import axios from "axios";

// Create a mock for the API calls
axios.interceptors.request.use((config) => {
  // This is just for development - in production, these would be real API calls
  const mockHandlers: Record<string, () => any> = {
    "/api/exercises": () => {
      return {
        status: 200,
        data: mockExercises,
      };
    },
    "/api/exercises/category/cardio": () => {
      return {
        status: 200,
        data: mockExercises.filter((ex) => ex.category === "cardio"),
      };
    },
    "/api/exercises/category/strength": () => {
      return {
        status: 200,
        data: mockExercises.filter((ex) => ex.category === "strength"),
      };
    },
    "/api/exercises/category/flexibility": () => {
      return {
        status: 200,
        data: mockExercises.filter((ex) => ex.category === "flexibility"),
      };
    },
    "/api/exercises/category/balance": () => {
      return {
        status: 200,
        data: mockExercises.filter((ex) => ex.category === "balance"),
      };
    },
  };

  // Check if this is a request we want to mock
  const url = config.url || "";
  const mockHandler = Object.keys(mockHandlers).find((key) =>
    url.endsWith(key)
  );

  if (mockHandler) {
    // Mock the response
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockHandlers[mockHandler]();
        config.adapter = () => Promise.resolve(response);
        resolve(config);
      }, 500); // Simulate network delay
    });
  }

  return config;
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
