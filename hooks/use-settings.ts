"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
} from "@/lib/storage/settings";
import type { Settings } from "@/lib/types";

export type UseSettingsResult = {
  hydrated: boolean;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
};

type State = {
  hydrated: boolean;
  settings: Settings;
};

const INITIAL_STATE: State = {
  hydrated: false,
  settings: DEFAULT_SETTINGS,
};

export function useSettings(): UseSettingsResult {
  const [state, setState] = useState<State>(INITIAL_STATE);

  useEffect(() => {
    const initial = loadSettings();
    // localStorage 初期 hydration: SSR/CSR 差分吸収のための 1 回限り setState。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ hydrated: true, settings: initial });
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((prev) => {
      const next = { ...prev.settings, ...patch };
      saveSettings(next);
      return { ...prev, settings: next };
    });
  }, []);

  return {
    hydrated: state.hydrated,
    settings: state.settings,
    updateSettings,
  };
}
