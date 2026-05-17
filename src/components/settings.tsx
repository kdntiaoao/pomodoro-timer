import { Clock2Icon } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon } from "./ui/input-group";

export function Settings() {
  return (
    <div>
      <form>
        <div>
          <label htmlFor="duration">設定時間</label>
          <InputGroup>
            <InputGroupInput
              id="duration"
              type="time"
              step="1"
              defaultValue="00:01:00"
              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
            <InputGroupAddon>
              <Clock2Icon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </form>
    </div>
  );
}
