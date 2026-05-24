"use client";

import {
  ActionDispatch,
  createContext,
  useReducer,
  type ReactNode,
} from "react";

interface Settings {
  workingDuration: {
    minutes: number;
    seconds: number;
  };
  breakDuration: {
    minutes: number;
    seconds: number;
  };
}

const initialSettings: Settings = {
  workingDuration: {
    minutes: 0,
    seconds: 10,
  },
  breakDuration: {
    minutes: 0,
    seconds: 5,
  },
};

export const SettingsContext = createContext<Settings | null>(null);
export const SettingsDispatchContext = createContext<ActionDispatch<
  [action: Settings]
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

function settingsReducer(_: Settings, action: Settings) {
  return {
    workingDuration: {
      minutes: action.workingDuration.minutes ?? 0,
      seconds: action.workingDuration.seconds ?? 0,
    },
    breakDuration: {
      minutes: action.breakDuration.minutes ?? 0,
      seconds: action.breakDuration.seconds ?? 0,
    },
  };
}
