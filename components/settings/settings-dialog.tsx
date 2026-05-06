"use client";

import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { GeneralSettingsForm } from "@/components/settings/general-settings-form";
import { PresetManager } from "@/components/settings/preset-manager";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="設定を開く">
          <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>設定</DialogTitle>
          <DialogDescription>
            通知 / 音量 / 自動遷移 / テーマ / プリセットを変更できる。
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="general">全般</TabsTrigger>
            <TabsTrigger value="presets">プリセット</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <GeneralSettingsForm />
          </TabsContent>
          <TabsContent value="presets">
            <PresetManager />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
