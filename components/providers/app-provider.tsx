"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePresets, type UsePresetsResult } from "@/hooks/use-presets";
import { useSessions, type UseSessionsResult } from "@/hooks/use-sessions";
import { useSettings, type UseSettingsResult } from "@/hooks/use-settings";

const PresetsContext = createContext<UsePresetsResult | null>(null);
const SettingsContext = createContext<UseSettingsResult | null>(null);
const SessionsContext = createContext<UseSessionsResult | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const presets = usePresets();
  const settings = useSettings();
  const sessions = useSessions();
  return (
    <PresetsContext.Provider value={presets}>
      <SettingsContext.Provider value={settings}>
        <SessionsContext.Provider value={sessions}>
          {children}
        </SessionsContext.Provider>
      </SettingsContext.Provider>
    </PresetsContext.Provider>
  );
}

export function usePresetsContext(): UsePresetsResult {
  const ctx = useContext(PresetsContext);
  if (ctx === null) {
    throw new Error("usePresetsContext must be used within AppProvider");
  }
  return ctx;
}

export function useSettingsContext(): UseSettingsResult {
  const ctx = useContext(SettingsContext);
  if (ctx === null) {
    throw new Error("useSettingsContext must be used within AppProvider");
  }
  return ctx;
}

export function useSessionsContext(): UseSessionsResult {
  const ctx = useContext(SessionsContext);
  if (ctx === null) {
    throw new Error("useSessionsContext must be used within AppProvider");
  }
  return ctx;
}
