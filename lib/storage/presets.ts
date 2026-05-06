import type { Preset } from "@/lib/types";
import { STORAGE_KEYS } from "./keys";
import { readStored, writeStored, type Validator } from "./local-storage";

const isPreset = (value: unknown): value is Preset => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.workMinutes === "number" &&
    typeof v.breakMinutes === "number" &&
    typeof v.createdAt === "number"
  );
};

const validatePresets: Validator<Preset[]> = (value): value is Preset[] =>
  Array.isArray(value) && value.every(isPreset);

const DEFAULT_PRESET_ID = "preset-classic";

const buildDefaultPreset = (now: number): Preset => ({
  id: DEFAULT_PRESET_ID,
  name: "クラシック 25/5",
  workMinutes: 25,
  breakMinutes: 5,
  createdAt: now,
});

export function loadPresets(): Preset[] {
  return readStored(STORAGE_KEYS.presets, validatePresets, []);
}

export function savePresets(presets: Preset[]): void {
  writeStored(STORAGE_KEYS.presets, presets);
}

export function ensureDefaultPreset(presets: Preset[], now: number): Preset[] {
  if (presets.length > 0) return presets;
  const seeded = [buildDefaultPreset(now)];
  savePresets(seeded);
  return seeded;
}
