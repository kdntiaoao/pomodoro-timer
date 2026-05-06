export function computeRemainingMs(endAt: number, now: number): number {
  const diff = endAt - now;
  return diff > 0 ? diff : 0;
}

export function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function minutesToMs(minutes: number): number {
  return minutes * 60 * 1000;
}
