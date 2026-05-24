import { useEffect, useRef, useState } from "react";

type Mode = "working" | "break";

export const SECOND_IN_MILLISECONDS = 1000;
export const MINUTE_IN_MILLISECONDS = 60 * SECOND_IN_MILLISECONDS;

export function useTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<Mode>("working");
  const [workingDurationMins, setWorkingDurationMins] = useState(0);
  const [workingDurationSecs, setWorkingDurationSecs] = useState(10);
  const [breakDurationMins, setBreakDurationMins] = useState(0);
  const [breakDurationSecs, setBreakDurationSecs] = useState(5);
  const [remainingMs, setRemainingMs] = useState(
    minutesAndSecondsToMs(workingDurationMins, workingDurationSecs),
  );
  const [pausedRemainingMs, setPausedRemainingMs] = useState(
    minutesAndSecondsToMs(workingDurationMins, workingDurationSecs),
  );
  const animationFrameIdRef = useRef<number>(null);

  const workingDurationMs = minutesAndSecondsToMs(
    workingDurationMins,
    workingDurationSecs,
  );
  const breakDurationMs = minutesAndSecondsToMs(
    breakDurationMins,
    breakDurationSecs,
  );

  const changeDurationMins = (mins: number) => {
    if (mode === "working") {
      setWorkingDurationMins(mins);
    } else {
      setBreakDurationMins(mins);
    }
    setRemainingMs(
      minutesAndSecondsToMs(
        mins,
        (remainingMs % MINUTE_IN_MILLISECONDS) / SECOND_IN_MILLISECONDS,
      ),
    );
    setPausedRemainingMs(
      minutesAndSecondsToMs(
        mins,
        (pausedRemainingMs % MINUTE_IN_MILLISECONDS) / SECOND_IN_MILLISECONDS,
      ),
    );
  };

  const changeDurationSecs = (secs: number) => {
    if (mode === "working") {
      setWorkingDurationSecs(secs);
    } else {
      setBreakDurationSecs(secs);
    }
    setRemainingMs(
      minutesAndSecondsToMs(
        mode === "working" ? workingDurationMins : breakDurationMins,
        secs,
      ),
    );
    setPausedRemainingMs(
      minutesAndSecondsToMs(
        mode === "working" ? workingDurationMins : breakDurationMins,
        secs,
      ),
    );
  };

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
    setPausedRemainingMs(remainingMs);
  };

  const reset = () => {
    setIsRunning(false);
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
    changeDurationMins,
    changeDurationSecs,
    start,
    pause,
    reset,
  };
}

function minutesAndSecondsToMs(mins: number, secs: number) {
  return mins * MINUTE_IN_MILLISECONDS + secs * SECOND_IN_MILLISECONDS;
}
