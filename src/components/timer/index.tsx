"use client";

import { ModeTabs } from "./mode-tabs";
import { SettingDialog } from "./setting-dialog";
import {
  MINUTE_IN_MILLISECONDS,
  SECOND_IN_MILLISECONDS,
  useTimer,
} from "./use-timer";
import { RotateCw } from "lucide-react";

export function Timer() {
  const {
    isRunning,
    remainingMs,
    workingDuration,
    breakDuration,
    start,
    pause,
    reset,
    changeWorkingDuration,
    changeBreakDuration,
  } = useTimer();

  return (
    <div className="flex flex-col items-center gap-8">
      <ModeTabs />
      <div className="flex items-center gap-3 font-mono text-[7rem] leading-none font-semibold">
        <span className="block">
          {Math.floor(remainingMs / MINUTE_IN_MILLISECONDS)
            .toString()
            .padStart(2, "0")}
        </span>
        <span className="flex flex-col gap-5">
          <span className="block size-3.5 bg-current"></span>
          <span className="block size-3.5 bg-current"></span>
        </span>
        <span className="block">
          {Math.floor(
            (remainingMs % MINUTE_IN_MILLISECONDS) / SECOND_IN_MILLISECONDS,
          )
            .toString()
            .padStart(2, "0")}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          data-state={isRunning ? "running" : "paused"}
          className="bg-primary text-primary-foreground group relative flex h-12 items-center justify-center overflow-hidden rounded-sm px-12 text-2xl font-medium transition active:scale-90"
          onClick={isRunning ? pause : start}
        >
          <div className="translate-x-0 transition group-data-[state=running]:translate-x-[-180%]">
            START
          </div>
          <div className="absolute translate-x-[180%] transition group-data-[state=running]:translate-x-0">
            PAUSE
          </div>
        </button>
        <button
          type="button"
          className="bg-primary text-primary-foreground group flex size-12 items-center justify-center rounded-sm transition active:scale-90"
          onClick={reset}
        >
          <RotateCw className="size-7 transition group-active:rotate-45" />
        </button>
        <SettingDialog
          workingDuration={workingDuration}
          breakDuration={breakDuration}
          changeWorkingDuration={changeWorkingDuration}
          changeBreakDuration={changeBreakDuration}
        />
      </div>
    </div>
  );
}
