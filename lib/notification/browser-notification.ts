const isSupported = (): boolean =>
  typeof window !== "undefined" && "Notification" in window;

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isSupported()) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isSupported()) return "unsupported";
  return Notification.permission;
}

export function showNotification(title: string, body: string): void {
  if (!isSupported()) return;
  if (Notification.permission !== "granted") return;
  new Notification(title, { body });
}
