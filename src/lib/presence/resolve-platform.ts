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
  // Online on Discord but not in a game → Discord icon
  if (!options.inGame) return "discord";

  const linked = new Set((options.connections ?? []).map((c) => c.type));
  const fromActivity = mapDiscordActivityPlatform(options.activityPlatform);

  // Discord activity.platform is the strongest signal (xbox / ps5 / desktop)
  if (fromActivity === "xbox" || fromActivity === "playstation") {
    return fromActivity;
  }

  const status = options.clientStatus ?? {};
  // Console sessions show up on client_status even when activity.platform is missing
  if (status.xbox) return "xbox";
  if (status.playstation || status.ps4 || status.ps5) return "playstation";

  // PC / desktop Discord + in-game → Steam (or Epic if that's the only PC link)
  // Do not infer Xbox/PSN from connections alone — those mean linked, not "playing on".
  if (
    fromActivity === "steam" ||
    status.desktop ||
    status.web ||
    status.mobile
  ) {
    if (linked.has("epicgames") && !linked.has("steam")) return "epic";
    return "steam";
  }

  return "steam";
}
