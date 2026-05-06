import type { Session } from "@/lib/types";

export type DailyBucket = {
  date: Date;
  count: number;
};

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export type HeatmapCell = {
  date: Date;
  count: number;
  level: HeatmapLevel;
  isFuture: boolean;
};

export const HEATMAP_WEEKS = 13;
export const WEEKLY_BAR_DAYS = 7;

const startOfLocalDay = (ts: number): Date => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d;
};

const dayKey = (ts: number): string => {
  const d = startOfLocalDay(ts);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export function countSessionsByDay(sessions: Session[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const s of sessions) {
    const key = dayKey(s.completedAt);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

export function levelFromCount(count: number): HeatmapLevel {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

export function buildWeeklyBars(
  sessions: Session[],
  now: number,
): DailyBucket[] {
  const counts = countSessionsByDay(sessions);
  const today = startOfLocalDay(now);
  const result: DailyBucket[] = [];
  for (let i = WEEKLY_BAR_DAYS - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    result.push({
      date: day,
      count: counts.get(dayKey(day.getTime())) ?? 0,
    });
  }
  return result;
}

export function buildHeatmapWeeks(
  sessions: Session[],
  now: number,
): HeatmapCell[][] {
  const counts = countSessionsByDay(sessions);
  const today = startOfLocalDay(now);
  const todayDow = today.getDay();
  const startSunday = new Date(today);
  startSunday.setDate(today.getDate() - todayDow - (HEATMAP_WEEKS - 1) * 7);

  const weeks: HeatmapCell[][] = [];
  for (let w = 0; w < HEATMAP_WEEKS; w++) {
    const week: HeatmapCell[] = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startSunday);
      cellDate.setDate(startSunday.getDate() + w * 7 + d);
      const isFuture = cellDate.getTime() > today.getTime();
      const count = isFuture
        ? 0
        : (counts.get(dayKey(cellDate.getTime())) ?? 0);
      week.push({
        date: cellDate,
        count,
        level: isFuture ? 0 : levelFromCount(count),
        isFuture,
      });
    }
    weeks.push(week);
  }
  return weeks;
}
