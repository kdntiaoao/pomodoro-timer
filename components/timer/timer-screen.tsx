"use client";

import { Button } from "@/components/ui/button";
import { useTimer } from "@/hooks/use-timer";
import { formatRemaining } from "@/lib/timer/compute-remaining";

const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;

export function TimerScreen() {
  const timer = useTimer({
    workMinutes: DEFAULT_WORK_MINUTES,
    breakMinutes: DEFAULT_BREAK_MINUTES,
    autoTransition: false,
  });

  const phaseLabel = timer.phase === "work" ? "作業" : "休憩";

  return (
    <section
      role="timer"
      aria-label={`${phaseLabel}タイマー 残り ${formatRemaining(timer.remainingMs)}`}
      className="flex flex-col items-center gap-8"
    >
      <p className="text-lg font-medium tracking-wide text-muted-foreground">
        {phaseLabel}
      </p>
      <p className="font-mono text-7xl font-semibold tabular-nums tracking-tight sm:text-8xl">
        {formatRemaining(timer.remainingMs)}
      </p>
      <div className="flex gap-3">
        {timer.status === "idle" && (
          <Button size="lg" onClick={timer.start}>
            開始
          </Button>
        )}
        {timer.status === "running" && (
          <Button size="lg" onClick={timer.pause}>
            一時停止
          </Button>
        )}
        {timer.status === "paused" && (
          <Button size="lg" onClick={timer.resume}>
            再開
          </Button>
        )}
        <Button size="lg" variant="outline" onClick={timer.reset}>
          リセット
        </Button>
        <Button size="lg" variant="ghost" onClick={timer.skip}>
          次へ
        </Button>
      </div>
    </section>
  );
}
