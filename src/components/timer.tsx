import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type Status = "idle" | "progress" | "paused";

const initialSeconds = 1 * 60;

export function Timer() {
  const [status, setStatus] = useState<Status>("idle");
  const [startedTimestamp, setStartedTimestamp] = useState<number | null>(null);
  const [elapsedMilliseconds, setElapsedMilliseconds] = useState(0);
  const [seconds, setSeconds] = useState(initialSeconds);

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
      setSeconds(Math.max(Math.trunc(initialSeconds - elapsedSeconds), 0));

      if (elapsedSeconds >= initialSeconds) {
        setStatus("idle");
        setStartedTimestamp(null);
        setSeconds(initialSeconds);
        return;
      }

      req = requestAnimationFrame(step);
    };

    req = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(req);
    };
  }, [status, startedTimestamp, elapsedMilliseconds]);

  return (
    <div>
      <p className="text-4xl">
        {Math.trunc(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
      </p>
      <div>
        <Button onClick={start}>start</Button>
        <Button onClick={pause}>pause</Button>
      </div>
    </div>
  );
}
