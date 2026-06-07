import { useEffect, useRef, useState } from "react";

type Mode = "working" | "break";

export type Duration = {
  mins: number;
  secs: number;
};

export const SECOND_IN_MILLISECONDS = 1000;
export const MINUTE_IN_MILLISECONDS = 60 * SECOND_IN_MILLISECONDS;

export function useTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<Mode>("working");
  const [workingDuration, setWorkingDuration] = useState<Duration>({
    mins: 0,
    secs: 10,
  });
  const [breakDuration, setBreakDuration] = useState<Duration>({
    mins: 0,
    secs: 5,
  });
  const [remainingMs, setRemainingMs] = useState(
    minutesAndSecondsToMs(workingDuration.mins, workingDuration.secs),
  );
  const [pausedRemainingMs, setPausedRemainingMs] = useState(
    minutesAndSecondsToMs(workingDuration.mins, workingDuration.secs),
  );
  const animationFrameIdRef = useRef<number>(null);

  const workingDurationMs = minutesAndSecondsToMs(
    workingDuration.mins,
    workingDuration.secs,
  );
  const breakDurationMs = minutesAndSecondsToMs(
    breakDuration.mins,
    breakDuration.secs,
  );

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
    setPausedRemainingMs(remainingMs);
  };

  const reset = () => {
    setIsRunning(false);
    setMode("working");
    setRemainingMs(workingDurationMs);
    setPausedRemainingMs(workingDurationMs);
  };

  const changeWorkingDuration = (duration: Duration) => {
    setWorkingDuration(duration);
    if (mode === "working") {
      setRemainingMs(minutesAndSecondsToMs(duration.mins, duration.secs));
      setPausedRemainingMs(minutesAndSecondsToMs(duration.mins, duration.secs));
    }
  };

  const changeBreakDuration = (duration: Duration) => {
    setBreakDuration(duration);
    if (mode === "break") {
      setRemainingMs(minutesAndSecondsToMs(duration.mins, duration.secs));
      setPausedRemainingMs(minutesAndSecondsToMs(duration.mins, duration.secs));
    }
  };

  useEffect(() => {
    if (!isRunning) {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      return;
    }

    const now = performance.now();
    const countdownTo = now + pausedRemainingMs;

    const countdown = () => {
      // 描画用の残り時間を毎フレーム更新する
      const currentTime = performance.now();
      const timeLeft = countdownTo - currentTime;

      if (timeLeft < 0) {
        setIsRunning(false);
        if (mode === "working") {
          setMode("break");
          setRemainingMs(breakDurationMs);
          setPausedRemainingMs(breakDurationMs);
        } else {
          setMode("working");
          setRemainingMs(workingDurationMs);
          setPausedRemainingMs(workingDurationMs);
        }
        window.setTimeout(() => {
          setIsRunning(true);
        }, 1000);
        return;
      }

      setRemainingMs(timeLeft);

      // 次のフレームで再描画する
      animationFrameIdRef.current = requestAnimationFrame(countdown);
    };

    animationFrameIdRef.current = requestAnimationFrame(countdown);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [breakDurationMs, isRunning, mode, pausedRemainingMs, workingDurationMs]);

  return {
    isRunning,
    remainingMs,
    workingDuration,
    breakDuration,
    start,
    pause,
    reset,
    changeWorkingDuration,
    changeBreakDuration,
  };
}

function minutesAndSecondsToMs(mins: number, secs: number) {
  return mins * MINUTE_IN_MILLISECONDS + secs * SECOND_IN_MILLISECONDS;
}
