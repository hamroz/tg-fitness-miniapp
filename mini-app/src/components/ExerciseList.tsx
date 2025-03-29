import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ContentCard from "./ContentCard";

const categories = ["all", "cardio", "strength", "flexibility", "balance"];

interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  isPremium: boolean;
}

const ExerciseList: React.FC = () => {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate fetching exercises
    setTimeout(() => {
      const demoExercises: Exercise[] = [
        {
          id: "1",
          name: "Running",
          category: "cardio",
          description: "Cardio exercise for endurance",
          imageUrl:
            "https://images.unsplash.com/photo-1571008887538-b36bb32f4571",
          isPremium: false,
        },
        {
          id: "2",
          name: "Pushups",
          category: "strength",
          description: "Upper body strength exercise",
          imageUrl:
            "https://images.unsplash.com/photo-1616803689943-5601631c7fec",
          isPremium: false,
        },
        {
          id: "3",
          name: "Yoga",
          category: "flexibility",
          description: "Flexibility and balance exercise",
          imageUrl:
            "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b",
          isPremium: true,
        },
      ];

      setExercises(demoExercises);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesCategory =
      category === "all" || exercise.category === category;
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mt-4">
      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-lg border border-border bg-paper px-4 py-2 pl-10 text-text outline-none focus:border-tg-button"
            placeholder={t("exercises.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary"
              onClick={() => setSearchQuery("")}
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
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`flex-shrink-0 rounded-full px-4 py-1 text-sm font-medium capitalize transition-all duration-200 ${
              category === cat
                ? "bg-tg-button text-white"
                : "bg-paper text-text-secondary hover:bg-tg-button/10"
            }`}
            onClick={() => setCategory(cat)}
          >
            {t(`exercises.categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Exercise list */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-tg-button border-r-transparent"></div>
          <p className="ml-4 text-text-secondary">{t("common.loading")}</p>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="py-10 text-center text-text-secondary">
          <p>{t("exercises.noResults")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExercises.map((exercise) => (
            <ContentCard key={exercise.id}>
              <div className="flex items-center">
                <div
                  className="h-16 w-16 rounded bg-cover bg-center"
                  style={{ backgroundImage: `url(${exercise.imageUrl})` }}
                ></div>
                <div className="ml-4 flex-grow">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">{exercise.name}</h3>
                    {exercise.isPremium && (
                      <span className="ml-2 rounded bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">
                    {exercise.description}
                  </p>
                </div>
              </div>
            </ContentCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
