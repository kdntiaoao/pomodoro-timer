"use client";

import {
  Add01Icon,
  Cancel01Icon,
  Delete02Icon,
  PencilEdit02Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { usePresetsContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Preset } from "@/lib/types";

type Draft = {
  name: string;
  workMinutes: number;
  breakMinutes: number;
};

const MIN_MINUTES = 1;
const MAX_MINUTES = 180;

const sanitizeMinutes = (value: number): number => {
  if (!Number.isFinite(value)) return MIN_MINUTES;
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(value)));
};

const isValid = (draft: Draft): boolean =>
  draft.name.trim().length > 0 &&
  draft.workMinutes >= MIN_MINUTES &&
  draft.workMinutes <= MAX_MINUTES &&
  draft.breakMinutes >= MIN_MINUTES &&
  draft.breakMinutes <= MAX_MINUTES;

export function PresetManager() {
  const { presets, addPreset, updatePreset, removePreset } =
    usePresetsContext();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 py-2">
      <ul className="flex flex-col gap-2">
        {presets.map((preset) => (
          <li key={preset.id}>
            {editingId === preset.id ? (
              <PresetEditForm
                initial={preset}
                onSubmit={(draft) => {
                  updatePreset(preset.id, draft);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <PresetRow
                preset={preset}
                canRemove={presets.length > 1}
                onEdit={() => setEditingId(preset.id)}
                onRemove={() => removePreset(preset.id)}
              />
            )}
          </li>
        ))}
      </ul>
      <CreatePresetForm onAdd={(draft) => addPreset(draft)} />
    </div>
  );
}

function PresetRow({
  preset,
  canRemove,
  onEdit,
  onRemove,
}: {
  preset: Preset;
  canRemove: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{preset.name}</span>
        <span className="text-xs text-muted-foreground">
          作業 {preset.workMinutes} 分 / 休憩 {preset.breakMinutes} 分
        </span>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`${preset.name} を編集`}
          onClick={onEdit}
        >
          <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`${preset.name} を削除`}
          onClick={onRemove}
          disabled={!canRemove}
        >
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

function PresetEditForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: Preset;
  onSubmit: (draft: Draft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Draft>({
    name: initial.name,
    workMinutes: initial.workMinutes,
    breakMinutes: initial.breakMinutes,
  });
  const valid = isValid(draft);

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border p-3">
      <DraftFields draft={draft} onChange={setDraft} idPrefix="edit" />
      <div className="flex justify-end gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="キャンセル"
          onClick={onCancel}
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
        </Button>
        <Button
          variant="default"
          size="icon-sm"
          aria-label="保存"
          disabled={!valid}
          onClick={() => valid && onSubmit(draft)}
        >
          <HugeiconsIcon icon={Tick01Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

function CreatePresetForm({ onAdd }: { onAdd: (draft: Draft) => void }) {
  const [draft, setDraft] = useState<Draft>({
    name: "",
    workMinutes: 25,
    breakMinutes: 5,
  });
  const valid = isValid(draft);
  const reset = () => setDraft({ name: "", workMinutes: 25, breakMinutes: 5 });

  return (
    <div className="flex flex-col gap-2 rounded-md border border-dashed border-border p-3">
      <DraftFields draft={draft} onChange={setDraft} idPrefix="create" />
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={!valid}
          onClick={() => {
            if (!valid) return;
            onAdd(draft);
            reset();
          }}
        >
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
          追加
        </Button>
      </div>
    </div>
  );
}

function DraftFields({
  draft,
  onChange,
  idPrefix,
}: {
  draft: Draft;
  onChange: (next: Draft) => void;
  idPrefix: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <Label htmlFor={`${idPrefix}-name`} className="text-xs">
          名前
        </Label>
        <Input
          id={`${idPrefix}-name`}
          value={draft.name}
          maxLength={40}
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor={`${idPrefix}-work`} className="text-xs">
            作業 (分)
          </Label>
          <Input
            id={`${idPrefix}-work`}
            type="number"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            value={draft.workMinutes}
            onChange={(e) =>
              onChange({
                ...draft,
                workMinutes: sanitizeMinutes(Number(e.target.value)),
              })
            }
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor={`${idPrefix}-break`} className="text-xs">
            休憩 (分)
          </Label>
          <Input
            id={`${idPrefix}-break`}
            type="number"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            value={draft.breakMinutes}
            onChange={(e) =>
              onChange({
                ...draft,
                breakMinutes: sanitizeMinutes(Number(e.target.value)),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
