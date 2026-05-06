import type { Settings } from "@/lib/types";
import { STORAGE_KEYS } from "./keys";
import { readStored, writeStored, type Validator } from "./local-storage";

export const DEFAULT_SETTINGS: Settings = {
  notificationEnabled: false,
  volume: 80,
  autoTransition: false,
};

const validateSettings: Validator<Settings> = (value): value is Settings => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.notificationEnabled === "boolean" &&
    typeof v.volume === "number" &&
    v.volume >= 0 &&
    v.volume <= 100 &&
    typeof v.autoTransition === "boolean"
  );
};

export function loadSettings(): Settings {
  return readStored(STORAGE_KEYS.settings, validateSettings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Settings): void {
  writeStored(STORAGE_KEYS.settings, settings);
}
