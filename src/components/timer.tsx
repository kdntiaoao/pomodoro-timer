import { useEffect, useState } from "react";

const initialSeconds = 1 * 60;

export function Timer() {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let req: number;

    const step = (timestamp: DOMHighResTimeStamp) => {
      setSeconds(Math.max(Math.trunc(initialSeconds - timestamp / 1000), 0));

      if (timestamp < initialSeconds * 1000) {
        req = requestAnimationFrame(step);
      }
    };

    req = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(req);
    };
  }, []);

  return (
    <div>
      <p className="text-4xl">
        {Math.trunc(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
      </p>
    </div>
  );
}
