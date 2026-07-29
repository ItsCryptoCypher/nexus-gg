import type { Platform } from "@/data/mock";

/** How long a Nexus heartbeat counts as “online on Nexus”. */
export const NEXUS_ONLINE_TTL_MS = 2 * 60 * 1000;

/** Company / system Discord accounts — hide from Play Now presence lists. */
export const PRESENCE_EXCLUDED_DISCORD_IDS = new Set([
  "1520508465926115329", // Apex Labs
]);

export type OnlineSource = {
  label: string;
  platform: Platform;
};

export function isNexusOnline(
  nexusLastSeenAt: string | null | undefined,
  nowMs: number = Date.now(),
): boolean {
  if (!nexusLastSeenAt) return false;
  const seen = Date.parse(nexusLastSeenAt);
  if (Number.isNaN(seen)) return false;
  return nowMs - seen <= NEXUS_ONLINE_TTL_MS;
}

export function isDiscordOnline(status: string | null | undefined): boolean {
  return Boolean(status && status !== "offline");
}

/** Prefer console client_status when online but not in a game. */
export function resolveIdleOnlineSource(
  clientStatus: Record<string, string> | null | undefined,
): OnlineSource {
  const status = clientStatus ?? {};
  if (status.xbox) {
    return { label: "Online on Xbox", platform: "xbox" };
  }
  if (status.playstation || status.ps4 || status.ps5) {
    return { label: "Online on PlayStation", platform: "playstation" };
  }
  return { label: "Online on Discord", platform: "discord" };
}

/**
 * Merge Discord + Nexus into a single online (not in-game) source.
 * Priority: Discord/console online > Nexus online.
 */
export function resolveOnlinePresence(options: {
  discordStatus: string | null | undefined;
  activityName: string | null | undefined;
  clientStatus: Record<string, string> | null | undefined;
  nexusLastSeenAt: string | null | undefined;
  nowMs?: number;
}): OnlineSource | null {
  if (options.activityName) return null;

  if (isDiscordOnline(options.discordStatus)) {
    return resolveIdleOnlineSource(options.clientStatus);
  }

  if (isNexusOnline(options.nexusLastSeenAt, options.nowMs)) {
    return { label: "Online on Nexus", platform: "nexus" };
  }

  return null;
}
