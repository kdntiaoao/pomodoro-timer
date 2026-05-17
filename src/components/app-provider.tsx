"use client";

import {
  ActionDispatch,
  createContext,
  useReducer,
  type ReactNode,
} from "react";

interface Settings {
  duration: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const initialSettings: Settings = {
  duration: {
    hours: 0,
    minutes: 1,
    seconds: 0,
  },
};

export const SettingsContext = createContext<Settings | null>(null);
export const SettingsDispatchContext = createContext<ActionDispatch<
  [
    action: {
      duration: Partial<Settings["duration"]>;
    },
  ]
> | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);

  return (
    <SettingsContext value={settings}>
      <SettingsDispatchContext value={dispatch}>
        {children}
      </SettingsDispatchContext>
    </SettingsContext>
  );
}

function settingsReducer(
  _: Settings,
  action: { duration: Partial<Settings["duration"]> },
) {
  return {
    duration: {
      hours: action.duration.hours ?? 0,
      minutes: action.duration.minutes ?? 0,
      seconds: action.duration.seconds ?? 0,
    },
  };
}
