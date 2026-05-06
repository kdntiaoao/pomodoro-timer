"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadSessions,
  pruneOldSessions,
  saveSessions,
} from "@/lib/storage/sessions";
import type { Session } from "@/lib/types";

export type SessionInput = Pick<
  Session,
  "presetId" | "presetName" | "workMinutes"
>;

export type UseSessionsResult = {
  hydrated: boolean;
  sessions: Session[];
  addSession: (input: SessionInput) => Session;
};

type State = {
  hydrated: boolean;
  sessions: Session[];
};

const INITIAL_STATE: State = {
  hydrated: false,
  sessions: [],
};

export function useSessions(): UseSessionsResult {
  const [state, setState] = useState<State>(INITIAL_STATE);

  useEffect(() => {
    const initial = pruneOldSessions(loadSessions(), Date.now());
    saveSessions(initial);
    // localStorage 初期 hydration: SSR/CSR 差分吸収のための 1 回限り setState。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ hydrated: true, sessions: initial });
  }, []);

  const addSession = useCallback((input: SessionInput): Session => {
    const now = Date.now();
    const next: Session = {
      ...input,
      id: crypto.randomUUID(),
      completedAt: now,
    };
    setState((prev) => {
      const merged = pruneOldSessions([...prev.sessions, next], now);
      const persisted = saveSessions(merged);
      return { ...prev, sessions: persisted };
    });
    return next;
  }, []);

  return {
    hydrated: state.hydrated,
    sessions: state.sessions,
    addSession,
  };
}
