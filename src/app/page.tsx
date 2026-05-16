import { Timer } from "@/components/timer";

export default function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Timer initial={{ minutes: 1 }} />
    </div>
  );
}
