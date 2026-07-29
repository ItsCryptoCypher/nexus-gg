import type { FriendPresence, Platform } from "@/data/mock";
import type { DiscordConnection } from "@/lib/discord/connections";
import {
  isDiscordOnline,
  isNexusOnline,
  resolveOnlinePresence,
} from "@/lib/presence/online-source";
import { resolvePlayingPlatform } from "@/lib/presence/resolve-platform";

export type PresenceSnippet = {
  status: string | null;
  activity_name: string | null;
  activity_platform: string | null;
  client_status: Record<string, string> | null;
};

export function mapFriendPresence(
  presence: PresenceSnippet | null | undefined,
  nexusLastSeenAt?: string | null,
): FriendPresence {
  if (presence?.activity_name) {
    return "in-game";
  }
  if (presence?.status === "idle" || presence?.status === "dnd") {
    return "away";
  }
  if (isDiscordOnline(presence?.status)) {
    return "online";
  }
  if (isNexusOnline(nexusLastSeenAt)) {
    return "online";
  }
  return "offline";
}

/** Subtitle for Online Now / friend cards when not offline. */
export function mapFriendOnlineLabel(options: {
  presence: PresenceSnippet | null | undefined;
  nexusLastSeenAt?: string | null;
}): string | null {
  const { presence, nexusLastSeenAt } = options;
  if (presence?.activity_name) {
    return presence.activity_name;
  }

  const source = resolveOnlinePresence({
    discordStatus: presence?.status,
    activityName: presence?.activity_name,
    clientStatus: presence?.client_status,
    nexusLastSeenAt,
  });

  return source?.label ?? null;
}

export function mapFriendOnlinePlatform(options: {
  presence: PresenceSnippet | null | undefined;
  nexusLastSeenAt?: string | null;
  connections: DiscordConnection[] | null | undefined;
}): Platform {
  const { presence, nexusLastSeenAt, connections } = options;

  if (presence?.activity_name) {
    return resolvePlayingPlatform({
      inGame: true,
      activityPlatform: presence.activity_platform,
      clientStatus: presence.client_status,
      connections,
    });
  }

  const source = resolveOnlinePresence({
    discordStatus: presence?.status,
    activityName: presence?.activity_name,
    clientStatus: presence?.client_status,
    nexusLastSeenAt,
  });

  return source?.platform ?? "discord";
}

function connectionToPlatform(type: string): Platform | null {
  if (type === "steam") return "steam";
  if (type === "xbox") return "xbox";
  if (type === "playstation") return "playstation";
  if (type === "epicgames") return "epic";
  return null;
}

export function mapFriendPlatforms(options: {
  presence: PresenceSnippet | null | undefined;
  connections: DiscordConnection[] | null | undefined;
  nexusLastSeenAt?: string | null;
}): Platform[] {
  const linked = (options.connections ?? [])
    .map((c) => connectionToPlatform(c.type))
    .filter((p): p is Platform => p != null);

  const unique = Array.from(new Set<Platform>(["discord", ...linked]));
  const presence = options.presence;

  if (presence?.activity_name) {
    const active = resolvePlayingPlatform({
      inGame: true,
      activityPlatform: presence.activity_platform,
      clientStatus: presence.client_status,
      connections: options.connections,
    });
    return Array.from(new Set<Platform>([active, ...unique]));
  }

  if (isNexusOnline(options.nexusLastSeenAt) && !isDiscordOnline(presence?.status)) {
    return Array.from(new Set<Platform>(["nexus", ...unique]));
  }

  return unique;
}

export function mapConnectionPlatform(type: string): Platform | null {
  return connectionToPlatform(type);
}
