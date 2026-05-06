"use client";

import { BarChartIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { MonthlyHeatmap } from "@/components/history/monthly-heatmap";
import { WeeklyBarChart } from "@/components/history/weekly-bar-chart";
import { useSessionsContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  buildHeatmapWeeks,
  buildWeeklyBars,
} from "@/lib/history/aggregate";

export function HistoryDialog() {
  const { sessions, hydrated } = useSessionsContext();
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setNow(Date.now());
    }
  };

  const weekly = useMemo(
    () => (now === null ? [] : buildWeeklyBars(sessions, now)),
    [sessions, now],
  );
  const heatmap = useMemo(
    () => (now === null ? [] : buildHeatmapWeeks(sessions, now)),
    [sessions, now],
  );
  const isEmpty = hydrated && sessions.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="履歴を開く">
          <HugeiconsIcon icon={BarChartIcon} strokeWidth={2} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>履歴</DialogTitle>
          <DialogDescription>
            完了した作業セッションの集計。
          </DialogDescription>
        </DialogHeader>
        {isEmpty ? (
          <p className="py-8 text-center text-xs text-muted-foreground">
            まだ完了したセッションがない
          </p>
        ) : now === null ? null : (
          <div className="flex flex-col gap-6 py-2">
            <section className="flex flex-col gap-2">
              <h3 className="text-xs font-medium">過去 7 日</h3>
              <WeeklyBarChart data={weekly} />
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="text-xs font-medium">直近 13 週</h3>
              <MonthlyHeatmap weeks={heatmap} />
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
