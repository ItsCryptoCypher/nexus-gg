import type { PlayingSession } from "@/data/mock";
import type { DiscordConnection } from "@/lib/discord/connections";
import { createClient } from "@/lib/supabase/server";
import { resolvePlayingPlatform } from "@/lib/presence/resolve-platform";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=240&fit=crop";

/** Company / system Discord accounts — hide from Who's Playing only. */
const WHOS_PLAYING_EXCLUDED_DISCORD_IDS = new Set([
  "1520508465926115329", // Apex Labs
]);

type PresenceRow = {
  discord_id: string;
  status: string;
  activity_name: string | null;
  activity_platform: string | null;
  client_status: Record<string, string> | null;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  discord_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
  discord_connections: DiscordConnection[] | null;
};

/** Map Discord presence rows into Who's Playing cards. */
export async function getPlayingSessions(): Promise<PlayingSession[]> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    return [];
  }

  const { data: presenceRows, error } = await supabase
    .from("player_presence")
    .select(
      "discord_id, status, activity_name, activity_platform, client_status, display_name, avatar_url, updated_at",
    )
    .neq("status", "offline")
    .order("updated_at", { ascending: false })
    .limit(24);

  if (error || !presenceRows?.length) {
    return [];
  }

  const rows = (presenceRows as PresenceRow[]).filter(
    (row) => !WHOS_PLAYING_EXCLUDED_DISCORD_IDS.has(row.discord_id),
  );
  if (!rows.length) {
    return [];
  }
  const discordIds = rows.map((r) => r.discord_id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, discord_id, display_name, avatar_url, discord_connections")
    .in("discord_id", discordIds);

  const profileByDiscord = new Map(
    ((profiles ?? []) as ProfileRow[])
      .filter((p) => p.discord_id)
      .map((p) => [p.discord_id as string, p]),
  );

  return rows.map((row): PlayingSession => {
    const profile = profileByDiscord.get(row.discord_id);
    const username =
      profile?.display_name ||
      row.display_name ||
      `Player ${row.discord_id.slice(-4)}`;
    const avatarUrl =
      profile?.avatar_url ||
      row.avatar_url ||
      `https://cdn.discordapp.com/embed/avatars/${Number(row.discord_id.slice(-2)) % 6}.png`;
    const inGame = Boolean(row.activity_name);
    const platform = resolvePlayingPlatform({
      inGame,
      activityPlatform: row.activity_platform,
      clientStatus: row.client_status,
      connections: profile?.discord_connections ?? [],
    });

    return {
      id: row.discord_id,
      username,
      avatarUrl,
      gameTitle: row.activity_name || "Online on Discord",
      coverUrl: FALLBACK_COVER,
      platform,
      status: inGame ? "in-game" : "looking",
      action: inGame ? "join-game" : "invite",
    };
  });
}
