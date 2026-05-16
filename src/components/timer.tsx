"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const SECOND_IN_MILLISECONDS = 1000;
const MINUTE_IN_MILLISECONDS = 60 * SECOND_IN_MILLISECONDS;
const HOUR_IN_MILLISECONDS = 60 * MINUTE_IN_MILLISECONDS;
const DAY_IN_MILLISECONDS = 24 * HOUR_IN_MILLISECONDS;

interface Props {
  initial: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  };
}

export function Timer({ initial }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const initialTime =
    (initial.hours ?? 0) * HOUR_IN_MILLISECONDS +
    (initial.minutes ?? 0) * MINUTE_IN_MILLISECONDS +
    (initial.seconds ?? 0) * SECOND_IN_MILLISECONDS;
  const [countdown, setCountdown] = useState(initialTime);
  const animationFrameIdRef = useRef<number>(null);

  const startTimer = () => {
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      return;
    }

    const now = performance.now();
    const countdownTo = now + initialTime;

    const countdown = () => {
      // 描画用の残り時間を毎フレーム更新する
      const currentTime = performance.now();
      const timeLeft = countdownTo - currentTime;

      // 期限切れなら終了メッセージを表示して処理を止める
      if (timeLeft < 0) {
        // TODO: 終了メッセージを表示するロジックを追加する
        return;
      }

      setCountdown(timeLeft);

      // 次のフレームで再描画する
      animationFrameIdRef.current = requestAnimationFrame(countdown);
    };

    animationFrameIdRef.current = requestAnimationFrame(countdown);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isRunning, initialTime]);

  return (
    <div>
      <p>{formatTimeLeft(countdown)}</p>
      <Button onClick={startTimer}>start</Button>
    </div>
  );
}

function formatTimeLeft(timeLeft: number): string {
  const daysLeft = Math.floor(timeLeft / DAY_IN_MILLISECONDS);

  const hoursLeft = Math.floor(
    (timeLeft % DAY_IN_MILLISECONDS) / HOUR_IN_MILLISECONDS,
  ).toLocaleString("en-US", { minimumIntegerDigits: 2 });

  const minutesLeft = Math.floor(
    (timeLeft % HOUR_IN_MILLISECONDS) / MINUTE_IN_MILLISECONDS,
  ).toLocaleString("en-US", { minimumIntegerDigits: 2 });

  const secondsLeft = Math.floor(
    (timeLeft % MINUTE_IN_MILLISECONDS) / SECOND_IN_MILLISECONDS,
  ).toLocaleString("en-US", { minimumIntegerDigits: 2 });

  return `${daysLeft}d:${hoursLeft}h:${minutesLeft}m:${secondsLeft}s`;
}
