"use client";

import { useTheme } from "next-themes";
import { useSettingsContext } from "@/components/providers/app-provider";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { requestNotificationPermission } from "@/lib/notification/browser-notification";

const THEME_OPTIONS: ReadonlyArray<{ value: "light" | "dark" | "system"; label: string }> = [
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
  { value: "system", label: "システム" },
];

export function GeneralSettingsForm() {
  const { settings, updateSettings } = useSettingsContext();
  const { theme, setTheme } = useTheme();

  const handleNotificationToggle = async (checked: boolean) => {
    if (!checked) {
      updateSettings({ notificationEnabled: false });
      return;
    }
    const permission = await requestNotificationPermission();
    updateSettings({ notificationEnabled: permission === "granted" });
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="settings-notification">ブラウザ通知</Label>
        <Switch
          id="settings-notification"
          checked={settings.notificationEnabled}
          onCheckedChange={(checked) => {
            void handleNotificationToggle(checked);
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="settings-volume">音量</Label>
          <span className="text-xs tabular-nums text-muted-foreground">
            {settings.volume}
          </span>
        </div>
        <Slider
          id="settings-volume"
          value={[settings.volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) =>
            updateSettings({ volume: values[0] ?? 0 })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="settings-auto-transition">自動遷移</Label>
        <Switch
          id="settings-auto-transition"
          checked={settings.autoTransition}
          onCheckedChange={(checked) =>
            updateSettings({ autoTransition: checked })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium">テーマ</span>
        <div role="radiogroup" aria-label="テーマ" className="flex gap-2">
          {THEME_OPTIONS.map((opt) => {
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setTheme(opt.value)}
                className="flex-1 rounded-md border border-input px-3 py-1.5 text-xs transition-colors aria-checked:bg-primary aria-checked:text-primary-foreground"
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
