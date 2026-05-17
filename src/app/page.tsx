import { Settings } from "@/components/settings";
import { Timer } from "@/components/timer";

export default function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div>
        <Timer duration={{ minutes: 1 }} />
        <Settings />
      </div>
    </div>
  );
}
