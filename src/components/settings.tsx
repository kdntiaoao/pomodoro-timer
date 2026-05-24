"use client";

import { Clock2Icon } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon } from "./ui/input-group";
import { useContext, useState } from "react";
import { SettingsDispatchContext } from "./app-provider";
import { Field, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";

export function Settings() {
  const [workingDuration, setWorkingDuration] = useState("00:00:00");
  const [breakDuration, setBreakDuration] = useState("00:00:00");
  const dispatch = useContext(SettingsDispatchContext);

  const handleDurationChange = () => {
    const [hours, minutes, seconds] = workingDuration.split(":").map(Number);
    const [breakHours, breakMinutes, breakSeconds] = breakDuration
      .split(":")
      .map(Number);

    dispatch?.({
      workingDuration: { minutes: hours * 60 + minutes, seconds },
      breakDuration: {
        minutes: breakHours * 60 + breakMinutes,
        seconds: breakSeconds,
      },
    });
  };

  return (
    <div>
      <Field>
        <FieldLabel htmlFor="working-duration">作業時間</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="working-duration"
            type="time"
            step="1"
            defaultValue="00:01:00"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            onChange={(e) => setWorkingDuration(e.currentTarget.value)}
          />
          <InputGroupAddon>
            <Clock2Icon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="break-duration">休憩時間</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="break-duration"
            type="time"
            step="1"
            defaultValue="00:01:00"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            onChange={(e) => setBreakDuration(e.currentTarget.value)}
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
