import { STORAGE_KEYS } from "./keys";
import { readStored, writeStored, type Validator } from "./local-storage";

const validateSelectedId: Validator<string | null> = (
  value,
): value is string | null => value === null || typeof value === "string";

export function loadSelectedPresetId(): string | null {
  return readStored<string | null>(
    STORAGE_KEYS.selectedPresetId,
    validateSelectedId,
    null,
  );
}

export function saveSelectedPresetId(id: string): void {
  writeStored(STORAGE_KEYS.selectedPresetId, id);
}
