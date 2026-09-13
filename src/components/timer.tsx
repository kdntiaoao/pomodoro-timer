import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type Status = "idle" | "progress" | "paused";

const initialSeconds = 1 * 60;

export function Timer() {
  const [status, setStatus] = useState<Status>("idle");
  const [startedTimestamp, setStartedTimestamp] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(initialSeconds);

  const start = () => {
    setStatus("progress");
    setStartedTimestamp(Date.now());
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

      const elapsedSeconds = (Date.now() - startedTimestamp) / 1000;
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
  }, [status, startedTimestamp]);

  return (
    <div>
      <p className="text-4xl">
        {Math.trunc(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
      </p>
      <div>
        <Button onClick={start}>start</Button>
      </div>
    </div>
  );
}
