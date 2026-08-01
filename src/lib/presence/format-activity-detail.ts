export type ActivityDetailFields = {
  state?: string | null;
  details?: string | null;
  startedAt?: string | Date | null;
  partySize?: number | null;
  partyMax?: number | null;
};

/** Compact elapsed label from an activity start time, e.g. "18m", "1h 5m". */
export function formatActivityElapsed(
  startedAt: string | Date | null | undefined,
  now = Date.now(),
): string | null {
  if (!startedAt) return null;
  const startMs =
    startedAt instanceof Date ? startedAt.getTime() : Date.parse(startedAt);
  if (!Number.isFinite(startMs) || startMs > now) return null;

  const totalSeconds = Math.floor((now - startMs) / 1000);
  if (totalSeconds < 60) return `${Math.max(totalSeconds, 1)}s`;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours <= 0) return `${minutes}m`;
  if (minutes <= 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Secondary Discord presence line: state · details · elapsed · party.
 * Omits empty parts so games without Rich Presence stay clean.
 */
export function formatActivityDetailLine(
  fields: ActivityDetailFields,
  now = Date.now(),
): string | null {
  const parts: string[] = [];

  const state = fields.state?.trim();
  const details = fields.details?.trim();
  if (state) parts.push(state);
  if (details && details !== state) parts.push(details);

  const elapsed = formatActivityElapsed(fields.startedAt, now);
  if (elapsed) parts.push(elapsed);

  const size = fields.partySize;
  const max = fields.partyMax;
  if (
    typeof size === "number" &&
    typeof max === "number" &&
    Number.isFinite(size) &&
    Number.isFinite(max) &&
    max > 0
  ) {
    parts.push(`${size}/${max}`);
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}
