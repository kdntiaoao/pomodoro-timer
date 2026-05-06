"use client";

import { useCallback } from "react";
import { HistoryDialog } from "@/components/history/history-dialog";
import { PresetSelector } from "@/components/timer/preset-selector";
import {
  usePresetsContext,
  useSettingsContext,
} from "@/components/providers/app-provider";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { usePhaseCompletionNotification } from "@/hooks/use-phase-completion-notification";
import { useSessionRecorder } from "@/hooks/use-session-recorder";
import { useTimer } from "@/hooks/use-timer";
import { formatRemaining } from "@/lib/timer/compute-remaining";
import type { TimerPhase } from "@/lib/types";

const FALLBACK_WORK_MINUTES = 25;
const FALLBACK_BREAK_MINUTES = 5;

export function TimerScreen() {
  const presets = usePresetsContext();
  const { settings } = useSettingsContext();
  const workMinutes =
    presets.selectedPreset?.workMinutes ?? FALLBACK_WORK_MINUTES;
  const breakMinutes =
    presets.selectedPreset?.breakMinutes ?? FALLBACK_BREAK_MINUTES;

  const notify = usePhaseCompletionNotification();
  const recordSession = useSessionRecorder();
  const onPhaseComplete = useCallback(
    (completedPhase: TimerPhase) => {
      notify(completedPhase);
      recordSession(completedPhase);
    },
    [notify, recordSession],
  );

  const timer = useTimer({
    workMinutes,
    breakMinutes,
    autoTransition: settings.autoTransition,
    onPhaseComplete,
  });

  const phaseLabel = timer.phase === "work" ? "作業" : "休憩";
  const isActive = timer.status !== "idle";
  const remainingText = formatRemaining(timer.remainingMs);
  useDocumentTitle(`${remainingText} ${phaseLabel} - ポモドーロ`);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex w-full justify-end gap-1">
        <HistoryDialog />
        <SettingsDialog />
      </div>
      <section
        role="timer"
        aria-label={`${phaseLabel}タイマー 残り ${remainingText}`}
        className="flex flex-col items-center gap-8"
      >
        <PresetSelector
          presets={presets.presets}
          selectedId={presets.selectedPresetId}
          onSelect={presets.selectPreset}
          disabled={isActive || !presets.hydrated}
        />
        <p className="text-lg font-medium tracking-wide text-muted-foreground">
          {phaseLabel}
        </p>
        <p className="font-mono text-7xl font-semibold tabular-nums tracking-tight sm:text-8xl">
          {remainingText}
        </p>
        <div className="flex gap-3">
          {timer.status === "idle" && (
            <Button size="lg" onClick={timer.start}>
              開始
            </Button>
          )}
          {timer.status === "running" && (
            <Button size="lg" onClick={timer.pause}>
              一時停止
            </Button>
          )}
          {timer.status === "paused" && (
            <Button size="lg" onClick={timer.resume}>
              再開
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={timer.reset}>
            リセット
          </Button>
          <Button size="lg" variant="ghost" onClick={timer.skip}>
            次へ
          </Button>
        </div>
      </section>
    </div>
  );
}
