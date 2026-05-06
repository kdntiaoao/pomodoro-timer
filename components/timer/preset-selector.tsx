"use client";

import type { Preset } from "@/lib/types";

type Props = {
  presets: Preset[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled: boolean;
};

export function PresetSelector({
  presets,
  selectedId,
  onSelect,
  disabled,
}: Props) {
  if (presets.length === 0) return null;
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">プリセット</span>
      <select
        value={selectedId ?? ""}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="bg-background focus-visible:border-ring focus-visible:ring-ring/30 rounded-md border border-input px-3 py-1.5 text-sm outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {presets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}({p.workMinutes}/{p.breakMinutes})
          </option>
        ))}
      </select>
    </label>
  );
}
