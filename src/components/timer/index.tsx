"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import {
  MINUTE_IN_MILLISECONDS,
  SECOND_IN_MILLISECONDS,
  useTimer,
} from "./use-timer";

const minuteOptions = Array.from({ length: 100 + 1 }, (_, i) => ({
  value: i.toString(),
  label: i.toString().padStart(2, "0"),
}));
const secondOptions = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString(),
  label: i.toString().padStart(2, "0"),
}));

export function Timer() {
  const {
    remainingMs,
    isRunning,
    changeDurationMins,
    changeDurationSecs,
    start,
    pause,
    reset,
  } = useTimer();

  return (
    <div>
      <div className="flex gap-2 font-mono">
        <Select
          disabled={isRunning}
          value={Math.floor(remainingMs / MINUTE_IN_MILLISECONDS).toString()}
          onValueChange={(value) => changeDurationMins(Number(value))}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {minuteOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          disabled={isRunning}
          value={Math.floor(
            (remainingMs % MINUTE_IN_MILLISECONDS) / SECOND_IN_MILLISECONDS,
          ).toString()}
          onValueChange={(value) => changeDurationSecs(Number(value))}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {secondOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={start}>start</Button>
      <Button onClick={pause}>pause</Button>
      <Button onClick={reset}>reset</Button>
    </div>
  );
}
