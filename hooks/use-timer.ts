"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  computeRemainingMs,
  minutesToMs,
} from "@/lib/timer/compute-remaining";
import type { TimerPhase, TimerStatus } from "@/lib/types";

const TICK_INTERVAL_MS = 250;

export type UseTimerOptions = {
  workMinutes: number;
  breakMinutes: number;
  autoTransition: boolean;
  onPhaseComplete?: (completedPhase: TimerPhase) => void;
};

export type UseTimerResult = {
  status: TimerStatus;
  phase: TimerPhase;
  remainingMs: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
};

export function useTimer(options: UseTimerOptions): UseTimerResult {
  const { workMinutes, breakMinutes, autoTransition, onPhaseComplete } =
    options;

  const phaseDurationMs = useCallback(
    (p: TimerPhase) => minutesToMs(p === "work" ? workMinutes : breakMinutes),
    [workMinutes, breakMinutes],
  );

  const [phase, setPhase] = useState<TimerPhase>("work");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [endAt, setEndAt] = useState<number | null>(null);
  const [activeRemainingMs, setActiveRemainingMs] = useState<number>(0);

  const remainingMs =
    status === "idle" ? phaseDurationMs(phase) : activeRemainingMs;

  const onPhaseCompleteRef = useRef(onPhaseComplete);
  useEffect(() => {
    onPhaseCompleteRef.current = onPhaseComplete;
  }, [onPhaseComplete]);

  useEffect(() => {
    if (status !== "running" || endAt === null) {
      return;
    }
    const tick = () => {
      const now = Date.now();
      const remaining = computeRemainingMs(endAt, now);
      setActiveRemainingMs(remaining);
      if (remaining <= 0) {
        const completed = phase;
        const next: TimerPhase = completed === "work" ? "break" : "work";
        onPhaseCompleteRef.current?.(completed);
        setPhase(next);
        if (autoTransition) {
          const nextDuration = phaseDurationMs(next);
          setEndAt(Date.now() + nextDuration);
          setActiveRemainingMs(nextDuration);
          setStatus("running");
        } else {
          setEndAt(null);
          setStatus("idle");
        }
      }
    };
    tick();
    const id = window.setInterval(tick, TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [status, endAt, phase, autoTransition, phaseDurationMs]);

  const start = useCallback(() => {
    if (status !== "idle") return;
    const duration = phaseDurationMs(phase);
    setEndAt(Date.now() + duration);
    setActiveRemainingMs(duration);
    setStatus("running");
  }, [status, phase, phaseDurationMs]);

  const pause = useCallback(() => {
    if (status !== "running" || endAt === null) return;
    const remaining = computeRemainingMs(endAt, Date.now());
    setActiveRemainingMs(remaining);
    setEndAt(null);
    setStatus("paused");
  }, [status, endAt]);

  const resume = useCallback(() => {
    if (status !== "paused") return;
    setEndAt(Date.now() + activeRemainingMs);
    setStatus("running");
  }, [status, activeRemainingMs]);

  const reset = useCallback(() => {
    setEndAt(null);
    setStatus("idle");
  }, []);

  const skip = useCallback(() => {
    setPhase((p) => (p === "work" ? "break" : "work"));
    setEndAt(null);
    setStatus("idle");
  }, []);

  return { status, phase, remainingMs, start, pause, resume, reset, skip };
}
