"use client";

import type { DailyBucket } from "@/lib/history/aggregate";

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"] as const;

type Props = {
  data: DailyBucket[];
};

export function WeeklyBarChart({ data }: Props) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex h-32 items-end justify-between gap-2">
        {data.map((d) => {
          const heightPct = (d.count / max) * 100;
          return (
            <li
              key={d.date.toISOString()}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {d.count}
              </span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-sm bg-primary"
                  style={{
                    height: `${heightPct}%`,
                    minHeight: d.count > 0 ? "4px" : "1px",
                    opacity: d.count > 0 ? 1 : 0.2,
                  }}
                  aria-label={`${d.date.toLocaleDateString("ja-JP")} ${d.count} 件`}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <ul className="flex justify-between gap-2">
        {data.map((d) => (
          <li
            key={d.date.toISOString()}
            className="flex-1 text-center text-[10px] leading-tight text-muted-foreground"
          >
            <span>{WEEKDAY_LABELS[d.date.getDay()]}</span>
            <br />
            <span className="tabular-nums">{d.date.getDate()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
