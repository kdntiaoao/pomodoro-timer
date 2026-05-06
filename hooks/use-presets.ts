"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ensureDefaultPreset,
  loadPresets,
  savePresets,
} from "@/lib/storage/presets";
import {
  loadSelectedPresetId,
  saveSelectedPresetId,
} from "@/lib/storage/selected-preset";
import type { Preset } from "@/lib/types";

export type PresetInput = Pick<Preset, "name" | "workMinutes" | "breakMinutes">;

export type UsePresetsResult = {
  hydrated: boolean;
  presets: Preset[];
  selectedPreset: Preset | null;
  selectedPresetId: string | null;
  selectPreset: (id: string) => void;
  addPreset: (input: PresetInput) => Preset;
  updatePreset: (id: string, patch: Partial<PresetInput>) => void;
  removePreset: (id: string) => void;
};

type State = {
  hydrated: boolean;
  presets: Preset[];
  selectedPresetId: string | null;
};

const INITIAL_STATE: State = {
  hydrated: false,
  presets: [],
  selectedPresetId: null,
};

export function usePresets(): UsePresetsResult {
  const [state, setState] = useState<State>(INITIAL_STATE);

  useEffect(() => {
    const initial = ensureDefaultPreset(loadPresets(), Date.now());
    const stored = loadSelectedPresetId();
    const valid =
      stored !== null && initial.some((p) => p.id === stored)
        ? stored
        : (initial[0]?.id ?? null);
    if (valid !== null && valid !== stored) {
      saveSelectedPresetId(valid);
    }
    // localStorage 初期 hydration: SSR/CSR 差分吸収のための 1 回限り setState。cascade 無し。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ hydrated: true, presets: initial, selectedPresetId: valid });
  }, []);

  const selectPreset = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedPresetId: id }));
    saveSelectedPresetId(id);
  }, []);

  const addPreset = useCallback((input: PresetInput): Preset => {
    const next: Preset = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setState((prev) => {
      const updated = [...prev.presets, next];
      savePresets(updated);
      return { ...prev, presets: updated };
    });
    return next;
  }, []);

  const updatePreset = useCallback(
    (id: string, patch: Partial<PresetInput>) => {
      setState((prev) => {
        const updated = prev.presets.map((p) =>
          p.id === id ? { ...p, ...patch } : p,
        );
        savePresets(updated);
        return { ...prev, presets: updated };
      });
    },
    [],
  );

  const removePreset = useCallback((id: string) => {
    setState((prev) => {
      if (prev.presets.length <= 1) return prev;
      const updated = prev.presets.filter((p) => p.id !== id);
      savePresets(updated);
      const nextSelectedId =
        prev.selectedPresetId === id
          ? (updated[0]?.id ?? null)
          : prev.selectedPresetId;
      if (nextSelectedId !== null && nextSelectedId !== prev.selectedPresetId) {
        saveSelectedPresetId(nextSelectedId);
      }
      return { ...prev, presets: updated, selectedPresetId: nextSelectedId };
    });
  }, []);

  const selectedPreset =
    state.presets.find((p) => p.id === state.selectedPresetId) ??
    state.presets[0] ??
    null;

  return {
    hydrated: state.hydrated,
    presets: state.presets,
    selectedPreset,
    selectedPresetId: state.selectedPresetId,
    selectPreset,
    addPreset,
    updatePreset,
    removePreset,
  };
}
