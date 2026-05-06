"use client";

import { useCallback } from "react";
import {
  usePresetsContext,
  useSessionsContext,
} from "@/components/providers/app-provider";
import type { TimerPhase } from "@/lib/types";

export function useSessionRecorder(): (completedPhase: TimerPhase) => void {
  const { selectedPreset } = usePresetsContext();
  const { addSession } = useSessionsContext();

  return useCallback(
    (completedPhase: TimerPhase) => {
      if (completedPhase !== "work") return;
      if (selectedPreset === null) return;
      addSession({
        presetId: selectedPreset.id,
        presetName: selectedPreset.name,
        workMinutes: selectedPreset.workMinutes,
      });
    },
    [selectedPreset, addSession],
  );
}
