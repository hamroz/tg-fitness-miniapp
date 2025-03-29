import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const WorkoutCalendar: React.FC = () => {
  const { t } = useTranslation();
  const [date, setDate] = useState(new Date());
  const [workoutDays, setWorkoutDays] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading workout data
    setTimeout(() => {
      const currentDate = new Date();
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      // Simulate some workout days (every 3 days)
      const mockWorkoutDays: Date[] = [];
      for (let i = 1; i <= daysInMonth; i += 3) {
        mockWorkoutDays.push(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
        );
      }

      setWorkoutDays(mockWorkoutDays);
      setIsLoading(false);
    }, 1000);
  }, []);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const isWorkoutDay = workoutDays.some(
        (workoutDate) =>
          workoutDate.getDate() === date.getDate() &&
          workoutDate.getMonth() === date.getMonth() &&
          workoutDate.getFullYear() === date.getFullYear()
      );

      return isWorkoutDay ? "workout-day" : null;
    }
    return null;
  };

  return (
    <div className="px-2 py-4">
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-tg-button border-r-transparent"></div>
          <p className="ml-4 text-text-secondary">{t("common.loading")}</p>
        </div>
      ) : (
        <div>
          <Calendar
            onChange={setDate}
            value={date}
            tileClassName={tileClassName}
          />
          <div className="mt-4 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
            <span className="ml-2">{t("progress.workoutDays")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutCalendar;
