import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ModeTabs() {
  return (
    <div>
      <Tabs defaultValue="working" size="lg">
        <TabsList variant="line">
          <TabsTrigger value="working">Working</TabsTrigger>
          <TabsTrigger value="break">Break</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
