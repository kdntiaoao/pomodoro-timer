import { SCHEMA_VERSION } from "./keys";

export type Stored<T> = {
  schemaVersion: number;
  data: T;
};

export type Validator<T> = (value: unknown) => value is T;

const isBrowser = (): boolean => typeof window !== "undefined";

export function readStored<T>(
  key: string,
  validate: Validator<T>,
  fallback: T,
): T {
  if (!isBrowser()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("schemaVersion" in parsed) ||
      !("data" in parsed)
    ) {
      throw new Error("invalid stored shape");
    }
    const stored = parsed as { schemaVersion: unknown; data: unknown };
    if (stored.schemaVersion !== SCHEMA_VERSION) {
      throw new Error(
        `unsupported schemaVersion: ${String(stored.schemaVersion)}`,
      );
    }
    if (!validate(stored.data)) {
      throw new Error("data validation failed");
    }
    return stored.data;
  } catch (err) {
    console.warn(`localStorage read failed for ${key}`, err);
    window.localStorage.removeItem(key);
    return fallback;
  }
}

export function writeStored<T>(key: string, data: T): void {
  if (!isBrowser()) return;
  const wrapped: Stored<T> = { schemaVersion: SCHEMA_VERSION, data };
  window.localStorage.setItem(key, JSON.stringify(wrapped));
}

export function isQuotaExceededError(err: unknown): boolean {
  if (!(err instanceof DOMException)) return false;
  return (
    err.name === "QuotaExceededError" ||
    err.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    err.code === 22 ||
    err.code === 1014
  );
}
