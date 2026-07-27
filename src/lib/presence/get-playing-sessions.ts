import type { PlayingSession } from "@/data/mock";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=240&fit=crop";

type PresenceRow = {
  discord_id: string;
  status: string;
  activity_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  discord_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
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
      "discord_id, status, activity_name, display_name, avatar_url, updated_at",
    )
    .neq("status", "offline")
    .order("updated_at", { ascending: false })
    .limit(24);

  if (error || !presenceRows?.length) {
    return [];
  }

  const rows = presenceRows as PresenceRow[];
  const discordIds = rows.map((r) => r.discord_id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, discord_id, display_name, avatar_url")
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
      `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(row.discord_id) % 6n)}.png`;
    const inGame = Boolean(row.activity_name);

    return {
      id: row.discord_id,
      username,
      avatarUrl,
      gameTitle: row.activity_name || "Online on Discord",
      coverUrl: FALLBACK_COVER,
      platform: "discord",
      status: inGame ? "in-game" : "looking",
      action: inGame ? "join-game" : "invite",
    };
  });
}
