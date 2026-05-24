"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { SettingsContext } from "./app-provider";

const SECOND_IN_MILLISECONDS = 1000;
const MINUTE_IN_MILLISECONDS = 60 * SECOND_IN_MILLISECONDS;

export function Timer() {
  const settings = useContext(SettingsContext);
  const [isStarted, setIsStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const workingDurationMs =
    (settings?.workingDuration.minutes ?? 0) * MINUTE_IN_MILLISECONDS +
    (settings?.workingDuration.seconds ?? 0) * SECOND_IN_MILLISECONDS;
  const [remainingMs, setRemainingMs] = useState(0);
  const [pausedRemainingMs, setPausedRemainingMs] = useState(0);
  const animationFrameIdRef = useRef<number>(null);

  const displayMs = isStarted ? remainingMs : workingDurationMs;

  const start = () => {
    if (!isStarted) {
      setRemainingMs(workingDurationMs);
      setPausedRemainingMs(workingDurationMs);
    }
    setIsStarted(true);
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
    setPausedRemainingMs(remainingMs);
  };

  const reset = () => {
    setIsStarted(false);
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
      <p>{formatTimeLeft(displayMs)}</p>
      {!isRunning && <Button onClick={start}>start</Button>}
      {isRunning && <Button onClick={pause}>pause</Button>}
      {isStarted && <Button onClick={reset}>reset</Button>}
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
