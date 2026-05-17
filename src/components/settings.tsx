"use client";

import { Clock2Icon } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon } from "./ui/input-group";
import { useContext, useState } from "react";
import { SettingsDispatchContext } from "./app-provider";
import { Field, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";

export function Settings() {
  const [duration, setDuration] = useState("00:01:00");
  const dispatch = useContext(SettingsDispatchContext);

  const handleDurationChange = () => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);

    dispatch?.({
      duration: { hours, minutes, seconds },
    });
  };

  return (
    <div>
      <Field>
        <FieldLabel htmlFor="duration">設定時間</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="duration"
            type="time"
            step="1"
            defaultValue="00:01:00"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            onChange={(e) => setDuration(e.currentTarget.value)}
          />
          <InputGroupAddon>
            <Clock2Icon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Button type="button" onClick={handleDurationChange}>
        save
      </Button>
    </div>
  );
}
