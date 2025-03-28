import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Exercise, ExerciseCategory, WorkoutLog } from "../types/exercise";
import { exerciseApi } from "../services/api";
import ExerciseCard from "./ExerciseCard";
import WorkoutLogForm from "./WorkoutLogForm";

// Define tabs for categories
const categories: { label: string; value: ExerciseCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Cardio", value: "cardio" },
  { label: "Strength", value: "strength" },
  { label: "Flexibility", value: "flexibility" },
  { label: "Balance", value: "balance" },
];

const ExerciseList = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<
    ExerciseCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [logFormOpen, setLogFormOpen] = useState(false);

  // Load exercises on component mount
  useEffect(() => {
    loadExercises();
  }, []);

  // Filter exercises when category or search changes
  useEffect(() => {
    filterExercises();
  }, [activeCategory, searchQuery, exercises]);

  const loadExercises = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await exerciseApi.getExercises();
      setExercises(data);
    } catch (err) {
      console.error("Error loading exercises:", err);
      setError("Failed to load exercises. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = [...exercises];

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (exercise) => exercise.category === activeCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(query) ||
          exercise.description.toLowerCase().includes(query) ||
          exercise.muscleGroup.some((muscle) =>
            muscle.toLowerCase().includes(query)
          ) ||
          exercise.equipment.some((item) => item.toLowerCase().includes(query))
      );
    }

    setFilteredExercises(filtered);
  };

  const handleCategoryChange = (
    _event: React.SyntheticEvent,
    newValue: ExerciseCategory | "all"
  ) => {
    setActiveCategory(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleLogWorkout = (
    exercise: Exercise,
    data: { reps?: number; sets?: number; duration?: number }
  ) => {
    setSelectedExercise(exercise);
    setLogFormOpen(true);
  };

  const handleWorkoutLogged = (log: WorkoutLog) => {
    console.log("Workout logged:", log);
    // You might want to update UI or show a success message
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exercise Library
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search exercises, muscles, equipment..."
        value={searchQuery}
        onChange={handleSearchChange}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton onClick={clearSearch} edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={activeCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab
              key={category.value}
              label={category.label}
              value={category.value}
            />
          ))}
        </Tabs>
      </Box>

      {/* Exercise Cards */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : filteredExercises.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No exercises found. Try a different search or category.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredExercises.map((exercise) => (
            <Grid item xs={12} key={exercise._id}>
              <ExerciseCard
                exercise={exercise}
                onLogWorkout={handleLogWorkout}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Workout Log Form */}
      {selectedExercise && (
        <WorkoutLogForm
          exercise={selectedExercise}
          open={logFormOpen}
          onClose={() => setLogFormOpen(false)}
          onSuccess={handleWorkoutLogged}
        />
      )}
    </Container>
  );
};

export default ExerciseList;
