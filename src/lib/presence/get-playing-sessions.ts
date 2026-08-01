import type { PlayingSession } from "@/data/mock";
import type { DiscordConnection } from "@/lib/discord/connections";
import { createClient } from "@/lib/supabase/server";
import { formatActivityDetailLine } from "@/lib/presence/format-activity-detail";
import { PRESENCE_EXCLUDED_DISCORD_IDS } from "@/lib/presence/online-source";
import { resolvePlayingPlatform } from "@/lib/presence/resolve-platform";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=240&fit=crop";

type PresenceRow = {
  discord_id: string;
  status: string;
  activity_name: string | null;
  activity_state: string | null;
  activity_details: string | null;
  activity_started_at: string | null;
  party_size: number | null;
  party_max: number | null;
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

/** Map in-game Discord presence rows into Who's Playing cards. */
export async function getPlayingSessions(): Promise<PlayingSession[]> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    return [];
  }

  const { data: presenceRows, error } = await supabase
    .from("player_presence")
    .select(
      "discord_id, status, activity_name, activity_state, activity_details, activity_started_at, party_size, party_max, activity_platform, client_status, display_name, avatar_url, updated_at",
    )
    .neq("status", "offline")
    .not("activity_name", "is", null)
    .order("updated_at", { ascending: false })
    .limit(24);

  if (error || !presenceRows?.length) {
    return [];
  }

  const rows = (presenceRows as PresenceRow[]).filter(
    (row) =>
      Boolean(row.activity_name) &&
      !PRESENCE_EXCLUDED_DISCORD_IDS.has(row.discord_id),
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
    const platform = resolvePlayingPlatform({
      inGame: true,
      activityPlatform: row.activity_platform,
      clientStatus: row.client_status,
      connections: profile?.discord_connections ?? [],
    });

    const partySize =
      typeof row.party_size === "number" ? row.party_size : undefined;
    const partyMax =
      typeof row.party_max === "number" ? row.party_max : undefined;
    const activityDetail = formatActivityDetailLine({
      state: row.activity_state,
      details: row.activity_details,
      startedAt: row.activity_started_at,
      // Party is shown on its own in the card badge row.
      partySize: null,
      partyMax: null,
    });

    return {
      id: row.discord_id,
      username,
      avatarUrl,
      gameTitle: row.activity_name!,
      activityDetail,
      coverUrl: FALLBACK_COVER,
      platform,
      status: "in-game",
      partySize,
      partyMax,
      action: "join-game",
    };
  });
}
