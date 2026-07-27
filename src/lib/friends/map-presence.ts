import type { FriendPresence, Platform } from "@/data/mock";
import type { DiscordConnection } from "@/lib/discord/connections";
import { resolvePlayingPlatform } from "@/lib/presence/resolve-platform";

export type PresenceSnippet = {
  status: string | null;
  activity_name: string | null;
  activity_platform: string | null;
  client_status: Record<string, string> | null;
};

export function mapFriendPresence(
  presence: PresenceSnippet | null | undefined,
): FriendPresence {
  if (!presence || !presence.status || presence.status === "offline") {
    return "offline";
  }
  if (presence.activity_name) {
    return "in-game";
  }
  if (presence.status === "idle" || presence.status === "dnd") {
    return "away";
  }
  return "online";
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

  return unique;
}

export function mapConnectionPlatform(type: string): Platform | null {
  return connectionToPlatform(type);
}
