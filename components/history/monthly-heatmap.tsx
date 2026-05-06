"use client";

import type { HeatmapCell, HeatmapLevel } from "@/lib/history/aggregate";

const LEVEL_BG: Record<HeatmapLevel, string> = {
  0: "bg-muted",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/60",
  4: "bg-primary",
};

const ROW_LABELS = ["", "月", "", "水", "", "金", ""] as const;

type Props = {
  weeks: HeatmapCell[][];
};

export function MonthlyHeatmap({ weeks }: Props) {
  return (
    <div className="flex gap-1.5">
      <ul className="flex flex-col gap-1 pt-0.5 text-[10px] leading-3 text-muted-foreground">
        {ROW_LABELS.map((label, i) => (
          <li
            key={i}
            className="flex h-3 items-center"
            aria-hidden={label === ""}
          >
            {label}
          </li>
        ))}
      </ul>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <ul key={wi} className="flex flex-col gap-1">
            {week.map((cell) => (
              <li
                key={cell.date.toISOString()}
                title={`${cell.date.toLocaleDateString("ja-JP")} ${cell.count} 件`}
                aria-label={`${cell.date.toLocaleDateString("ja-JP")}: ${cell.count} 件`}
                className={`h-3 w-3 rounded-sm ${LEVEL_BG[cell.level]} ${cell.isFuture ? "opacity-30" : ""}`}
              />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
