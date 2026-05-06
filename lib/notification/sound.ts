type WebAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const TONE_FREQUENCY_HZ = 880;
const TONE_DURATION_SEC = 0.5;
const ATTACK_SEC = 0.02;
const PEAK_GAIN_RATIO = 0.4;

let cachedContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (cachedContext !== null) return cachedContext;
  const win = window as WebAudioWindow;
  const Ctor = win.AudioContext ?? win.webkitAudioContext;
  if (!Ctor) return null;
  cachedContext = new Ctor();
  return cachedContext;
};

export function playNotificationSound(volume0to100: number): void {
  if (volume0to100 <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  const peak = (volume0to100 / 100) * PEAK_GAIN_RATIO;
  const now = ctx.currentTime;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + ATTACK_SEC);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + TONE_DURATION_SEC);
  gain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(TONE_FREQUENCY_HZ, now);
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + TONE_DURATION_SEC);
}
