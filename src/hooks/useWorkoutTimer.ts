import { useEffect, useRef, useState } from "react";

export type TimerMode = "stopwatch" | "countdown";

export const useWorkoutTimer = (initialSeconds = 0, mode: TimerMode = "stopwatch") => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) =>
        mode === "stopwatch" ? prev + 1 : Math.max(prev - 1, 0)
      );
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  useEffect(() => {
    if (mode === "countdown" && seconds === 0) {
      setIsRunning(false);
    }
  }, [seconds, mode]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (value = initialSeconds) => {
    setIsRunning(false);
    setSeconds(value);
  };

  return { seconds, isRunning, start, pause, reset };
};
