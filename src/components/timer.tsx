"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { SettingsContext } from "./app-provider";

const SECOND_IN_MILLISECONDS = 1000;
const MINUTE_IN_MILLISECONDS = 60 * SECOND_IN_MILLISECONDS;
const HOUR_IN_MILLISECONDS = 60 * MINUTE_IN_MILLISECONDS;

export function Timer() {
  const settings = useContext(SettingsContext);
  const [isRunning, setIsRunning] = useState(false);
  const durationMs =
    (settings?.duration.hours ?? 0) * HOUR_IN_MILLISECONDS +
    (settings?.duration.minutes ?? 0) * MINUTE_IN_MILLISECONDS +
    (settings?.duration.seconds ?? 0) * SECOND_IN_MILLISECONDS;
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [pausedRemainingMs, setPausedRemainingMs] = useState(durationMs);
  const animationFrameIdRef = useRef<number>(null);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
    setPausedRemainingMs(remainingMs);
  };

  const reset = () => {
    setIsRunning(false);
    setRemainingMs(durationMs);
    setPausedRemainingMs(durationMs);
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

      // 期限切れなら終了メッセージを表示して処理を止める
      if (timeLeft < 0) {
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
  }, [isRunning, pausedRemainingMs]);

  return (
    <div>
      <p>{formatTimeLeft(remainingMs)}</p>
      <Button onClick={start}>start</Button>
      <Button onClick={pause}>pause</Button>
      <Button onClick={reset}>reset</Button>
    </div>
  );
}

function formatTimeLeft(timeLeft: number): string {
  const minutesLeft = Math.floor(
    timeLeft / MINUTE_IN_MILLISECONDS,
  ).toLocaleString("en-US", { minimumIntegerDigits: 2 });

  const secondsLeft = Math.floor(
    (timeLeft % MINUTE_IN_MILLISECONDS) / SECOND_IN_MILLISECONDS,
  ).toLocaleString("en-US", { minimumIntegerDigits: 2 });

  return `${minutesLeft}:${secondsLeft}`;
}
