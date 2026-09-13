import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";

type Status = "idle" | "progress" | "paused";
type Mode = "working" | "break";

const WORKING_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export function Timer() {
  const [status, setStatus] = useState<Status>("idle");
  const [startedTimestamp, setStartedTimestamp] = useState<number | null>(null);
  const [elapsedMilliseconds, setElapsedMilliseconds] = useState(0);
  const [seconds, setSeconds] = useState(WORKING_TIME);
  const [mode, setMode] = useState<Mode>("working");

  const currentModeTime = mode === "working" ? WORKING_TIME : BREAK_TIME;
  const min = Math.trunc(seconds / 60)
    .toString()
    .padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");

  const start = () => {
    if (status === "progress") {
      return;
    }
    setStatus("progress");
    setStartedTimestamp(Date.now());
  };

  const pause = () => {
    if (status !== "progress" || !startedTimestamp) {
      return;
    }
    setStatus("paused");
    setElapsedMilliseconds((prev) => prev + Date.now() - startedTimestamp);
  };

  const changeMode = useCallback(() => {
    setStatus("idle");
    setStartedTimestamp(null);
    if (mode === "working") {
      setSeconds(BREAK_TIME);
      setMode("break");
    } else {
      setSeconds(WORKING_TIME);
      setMode("working");
    }
  }, [mode]);

  useEffect(() => {
    if (status !== "progress") {
      return;
    }

    let req: number;

    const step = () => {
      if (!startedTimestamp) {
        return;
      }

      const elapsedSeconds = (elapsedMilliseconds + Date.now() - startedTimestamp) / 1000;
      setSeconds(Math.max(Math.trunc(currentModeTime - elapsedSeconds), 0));

      if (elapsedSeconds >= currentModeTime) {
        changeMode();
        return;
      }

      req = requestAnimationFrame(step);
    };

    req = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(req);
    };
  }, [status, startedTimestamp, elapsedMilliseconds, changeMode, currentModeTime]);

  return (
    <div>
      <p>{mode}</p>
      <p className="text-4xl">
        {min}:{sec}
      </p>
      <div>
        <Button onClick={start}>start</Button>
        <Button onClick={pause}>pause</Button>
      </div>
    </div>
  );
}
