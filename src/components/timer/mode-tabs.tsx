import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mode } from "./use-timer";

type Props = {
  value: Mode;
  changeMode: (mode: Mode) => void;
};

export function ModeTabs({ value, changeMode }: Props) {
  const handleValueChange = (newValue: string) => {
    if (newValue !== "working" && newValue !== "break") {
      return;
    }

    changeMode(newValue);
  };

  return (
    <div>
      <Tabs
        defaultValue="working"
        value={value}
        size="lg"
        onValueChange={handleValueChange}
      >
        <TabsList variant="line">
          <TabsTrigger value="working">Working</TabsTrigger>
          <TabsTrigger value="break">Break</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
