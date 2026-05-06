import type { Session } from "@/lib/types";
import { STORAGE_KEYS } from "./keys";
import {
  isQuotaExceededError,
  readStored,
  writeStored,
  type Validator,
} from "./local-storage";

const isSession = (value: unknown): value is Session => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.presetId === "string" &&
    typeof v.presetName === "string" &&
    typeof v.workMinutes === "number" &&
    typeof v.completedAt === "number"
  );
};

const validateSessions: Validator<Session[]> = (value): value is Session[] =>
  Array.isArray(value) && value.every(isSession);

const RETENTION_DAYS = 365;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const QUOTA_RETRY_LIMIT = 5;
const QUOTA_DROP_RATIO = 0.2;

export function loadSessions(): Session[] {
  return readStored(STORAGE_KEYS.sessions, validateSessions, []);
}

export function pruneOldSessions(sessions: Session[], now: number): Session[] {
  const cutoff = now - RETENTION_DAYS * MS_PER_DAY;
  return sessions.filter((s) => s.completedAt >= cutoff);
}

export function saveSessions(sessions: Session[]): Session[] {
  const sorted = [...sessions].sort((a, b) => a.completedAt - b.completedAt);
  let candidate = sorted;
  for (let attempt = 0; attempt < QUOTA_RETRY_LIMIT; attempt++) {
    try {
      writeStored(STORAGE_KEYS.sessions, candidate);
      return candidate;
    } catch (err) {
      if (!isQuotaExceededError(err)) throw err;
      const dropCount = Math.max(1, Math.floor(candidate.length * QUOTA_DROP_RATIO));
      candidate = candidate.slice(dropCount);
      if (candidate.length === 0) {
        try {
          writeStored(STORAGE_KEYS.sessions, []);
        } catch {
          console.warn("failed to write sessions even when empty");
        }
        return [];
      }
    }
  }
  console.warn(
    `sessions write quota retries exhausted, kept ${candidate.length} entries`,
  );
  return candidate;
}
