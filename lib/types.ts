export type TimerPhase = "work" | "break";

export type TimerStatus = "idle" | "running" | "paused";

export type TimerState = {
  status: TimerStatus;
  phase: TimerPhase;
  endAt: number | null;
  remainingMs: number;
};

export type Preset = {
  id: string;
  name: string;
  workMinutes: number;
  breakMinutes: number;
  createdAt: number;
};

export type Session = {
  id: string;
  presetId: string;
  presetName: string;
  workMinutes: number;
  completedAt: number;
};

export type ThemeMode = "light" | "dark" | "system";

export type Settings = {
  notificationEnabled: boolean;
  volume: number;
  autoTransition: boolean;
};
