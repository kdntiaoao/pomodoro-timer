import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Duration } from "./use-timer";

const minuteOptions = Array.from({ length: 100 + 1 }, (_, i) => ({
  value: i.toString(),
  label: i.toString().padStart(2, "0"),
}));
const secondOptions = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString(),
  label: i.toString().padStart(2, "0"),
}));

type SettingDialogProps = {
  workingDuration: Duration;
  breakDuration: Duration;
  changeWorkingDuration: (duration: Duration) => void;
  changeBreakDuration: (duration: Duration) => void;
};

export function SettingDialog(props: SettingDialogProps) {
  const {
    workingDuration,
    breakDuration,
    changeWorkingDuration,
    changeBreakDuration,
  } = props;

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button
            type="button"
            className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-sm transition active:scale-90"
          >
            <Settings className="size-7.5" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Setting</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="working-1">Working</Label>
              <div className="flex gap-2 font-mono">
                <Select
                  value={workingDuration.mins.toString()}
                  onValueChange={(value) =>
                    changeWorkingDuration({
                      ...workingDuration,
                      mins: Number(value),
                    })
                  }
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {minuteOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={workingDuration.secs.toString()}
                  onValueChange={(value) =>
                    changeWorkingDuration({
                      ...workingDuration,
                      secs: Number(value),
                    })
                  }
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {secondOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </Field>
            <Field>
              <Label htmlFor="break-1">Break</Label>
              <div className="flex gap-2 font-mono">
                <Select
                  value={breakDuration.mins.toString()}
                  onValueChange={(value) =>
                    changeBreakDuration({
                      ...breakDuration,
                      mins: Number(value),
                    })
                  }
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {minuteOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={breakDuration.secs.toString()}
                  onValueChange={(value) =>
                    changeBreakDuration({
                      ...breakDuration,
                      secs: Number(value),
                    })
                  }
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {secondOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
