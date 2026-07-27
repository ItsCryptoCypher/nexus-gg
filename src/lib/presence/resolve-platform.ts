import type { Platform } from "@/data/mock";
import type { DiscordConnection } from "@/lib/discord/connections";

/** Map Discord activity.platform / client_status into our Platform icon. */
export function mapDiscordActivityPlatform(
  activityPlatform: string | null | undefined,
): Platform | null {
  if (!activityPlatform) return null;
  const p = activityPlatform.toLowerCase();

  if (p === "xbox") return "xbox";
  if (p === "ps4" || p === "ps5" || p === "playstation") return "playstation";
  if (p === "desktop" || p === "windows" || p === "osx" || p === "linux") {
    return "steam"; // PC games — refined by linked accounts below
  }
  return null;
}

export function resolvePlayingPlatform(options: {
  inGame: boolean;
  activityPlatform: string | null | undefined;
  clientStatus: Record<string, string> | null | undefined;
  connections: DiscordConnection[] | null | undefined;
}): Platform {
  if (!options.inGame) return "discord";

  const linked = new Set((options.connections ?? []).map((c) => c.type));
  const fromActivity = mapDiscordActivityPlatform(options.activityPlatform);
  if (fromActivity === "xbox" || fromActivity === "playstation") {
    return fromActivity;
  }

  const status = options.clientStatus ?? {};
  if (status.xbox) return "xbox";
  if (status.playstation || status.ps4 || status.ps5) return "playstation";

  // PC / desktop activity → prefer Steam, then Epic, then Discord
  if (
    fromActivity === "steam" ||
    status.desktop ||
    status.web ||
    status.mobile
  ) {
    if (linked.has("steam")) return "steam";
    if (linked.has("epicgames")) return "epic";
    if (linked.has("xbox")) return "xbox";
    return "discord";
  }

  const gaming = (["steam", "xbox", "playstation"] as const).filter((t) =>
    linked.has(t),
  );
  if (gaming.length === 1) return gaming[0];

  return "discord";
}
