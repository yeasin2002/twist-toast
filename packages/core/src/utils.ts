let counter = 0;

export function createToastId(): string {
  counter += 1;
  return `tt-${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function clampDuration(
  duration: number | undefined,
  fallback: number,
): number {
  if (typeof duration !== "number" || Number.isNaN(duration)) return fallback;
  return Math.max(0, duration);
}
