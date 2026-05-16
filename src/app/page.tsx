import { Timer } from "@/components/timer";

export default function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Timer duration={{ minutes: 1 }} />
    </div>
  );
}
