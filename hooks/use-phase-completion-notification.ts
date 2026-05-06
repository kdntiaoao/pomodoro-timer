"use client";

import { useCallback } from "react";
import { useSettingsContext } from "@/components/providers/app-provider";
import { showNotification } from "@/lib/notification/browser-notification";
import { playNotificationSound } from "@/lib/notification/sound";
import type { TimerPhase } from "@/lib/types";

const MESSAGES: Record<TimerPhase, { title: string; body: string }> = {
  work: { title: "作業セッション完了", body: "休憩を始めよう" },
  break: { title: "休憩セッション完了", body: "次の作業に取り組もう" },
};

export function usePhaseCompletionNotification(): (
  completedPhase: TimerPhase,
) => void {
  const { settings } = useSettingsContext();
  const { notificationEnabled, volume } = settings;

  return useCallback(
    (completedPhase: TimerPhase) => {
      const message = MESSAGES[completedPhase];
      if (notificationEnabled) {
        showNotification(message.title, message.body);
      }
      playNotificationSound(volume);
    },
    [notificationEnabled, volume],
  );
}
