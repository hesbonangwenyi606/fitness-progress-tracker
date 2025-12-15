import React from "react";
import { useWorkoutTimer } from "../hooks/useWorkoutTimer";

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const WorkoutTimer: React.FC = () => {
  const { seconds, isRunning, start, pause, reset } =
    useWorkoutTimer(0, "stopwatch");

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg text-center">
      <h2 className="text-xl font-semibold mb-4">Workout Timer</h2>

      <div className="text-5xl font-mono mb-6">
        {formatTime(seconds)}
      </div>

      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={start}
            className="px-4 py-2 bg-green-600 rounded-lg"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="px-4 py-2 bg-yellow-500 rounded-lg"
          >
            Pause
          </button>
        )}

        <button
          onClick={() => reset(0)}
          className="px-4 py-2 bg-red-600 rounded-lg"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default WorkoutTimer;
