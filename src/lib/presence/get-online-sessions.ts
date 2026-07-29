import type { OnlineFriend, Platform } from "@/data/mock";
import type { DiscordConnection } from "@/lib/discord/connections";
import { createClient } from "@/lib/supabase/server";
import {
  NEXUS_ONLINE_TTL_MS,
  PRESENCE_EXCLUDED_DISCORD_IDS,
  resolveOnlinePresence,
} from "@/lib/presence/online-source";

type PresenceRow = {
  discord_id: string;
  user_id: string | null;
  status: string;
  activity_name: string | null;
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
  nexus_last_seen_at: string | null;
};

function fallbackAvatar(seed: string) {
  const n = Number(seed.replace(/\D/g, "").slice(-2) || 0) % 6;
  return `https://cdn.discordapp.com/embed/avatars/${n}.png`;
}

/** People online on Nexus/Discord/console but not in a game. */
export async function getOnlineSessions(): Promise<OnlineFriend[]> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    return [];
  }

  const now = Date.now();
  const nexusCutoff = new Date(now - NEXUS_ONLINE_TTL_MS).toISOString();

  const [{ data: presenceRows }, { data: nexusProfiles }] = await Promise.all([
    supabase
      .from("player_presence")
      .select(
        "discord_id, user_id, status, activity_name, client_status, display_name, avatar_url, updated_at",
      )
      .neq("status", "offline")
      .is("activity_name", null)
      .order("updated_at", { ascending: false })
      .limit(48),
    supabase
      .from("profiles")
      .select(
        "id, discord_id, display_name, avatar_url, discord_connections, nexus_last_seen_at",
      )
      .gte("nexus_last_seen_at", nexusCutoff)
      .limit(48),
  ]);

  const idlePresence = ((presenceRows ?? []) as PresenceRow[]).filter(
    (row) => !PRESENCE_EXCLUDED_DISCORD_IDS.has(row.discord_id),
  );

  const discordIds = idlePresence.map((r) => r.discord_id);
  const presenceUserIds = idlePresence
    .map((r) => r.user_id)
    .filter((id): id is string => Boolean(id));
  const nexusProfileIds = ((nexusProfiles ?? []) as ProfileRow[]).map(
    (p) => p.id,
  );

  const profileIds = Array.from(
    new Set([...presenceUserIds, ...nexusProfileIds]),
  );

  const [{ data: profilesByDiscord }, { data: profilesById }] =
    await Promise.all([
      discordIds.length
        ? supabase
            .from("profiles")
            .select(
              "id, discord_id, display_name, avatar_url, discord_connections, nexus_last_seen_at",
            )
            .in("discord_id", discordIds)
        : Promise.resolve({ data: [] as ProfileRow[] }),
      profileIds.length
        ? supabase
            .from("profiles")
            .select(
              "id, discord_id, display_name, avatar_url, discord_connections, nexus_last_seen_at",
            )
            .in("id", profileIds)
        : Promise.resolve({ data: [] as ProfileRow[] }),
    ]);

  const profileByDiscord = new Map<string, ProfileRow>();
  const profileById = new Map<string, ProfileRow>();

  for (const p of (profilesByDiscord ?? []) as ProfileRow[]) {
    profileById.set(p.id, p);
    if (p.discord_id) profileByDiscord.set(p.discord_id, p);
  }
  for (const p of (profilesById ?? []) as ProfileRow[]) {
    profileById.set(p.id, p);
    if (p.discord_id) profileByDiscord.set(p.discord_id, p);
  }
  for (const p of (nexusProfiles ?? []) as ProfileRow[]) {
    profileById.set(p.id, p);
    if (p.discord_id) profileByDiscord.set(p.discord_id, p);
  }

  // Also load Discord presence for Nexus-online users (may be offline / in-game)
  const nexusDiscordIds = ((nexusProfiles ?? []) as ProfileRow[])
    .map((p) => p.discord_id)
    .filter((id): id is string => Boolean(id))
    .filter((id) => !discordIds.includes(id));

  let extraPresence: PresenceRow[] = [];
  if (nexusDiscordIds.length) {
    const { data } = await supabase
      .from("player_presence")
      .select(
        "discord_id, user_id, status, activity_name, client_status, display_name, avatar_url, updated_at",
      )
      .in("discord_id", nexusDiscordIds);
    extraPresence = (data ?? []) as PresenceRow[];
  }

  const presenceByDiscord = new Map<string, PresenceRow>();
  for (const row of [...idlePresence, ...extraPresence]) {
    presenceByDiscord.set(row.discord_id, row);
  }

  type Candidate = {
    id: string;
    username: string;
    avatarUrl: string;
    gameTitle: string;
    platform: Platform;
    sortAt: number;
  };

  const byId = new Map<string, Candidate>();

  const upsert = (candidate: Candidate) => {
    const existing = byId.get(candidate.id);
    if (!existing || candidate.sortAt > existing.sortAt) {
      byId.set(candidate.id, candidate);
    }
  };

  for (const row of idlePresence) {
    const profile = profileByDiscord.get(row.discord_id);
    const source = resolveOnlinePresence({
      discordStatus: row.status,
      activityName: row.activity_name,
      clientStatus: row.client_status,
      nexusLastSeenAt: profile?.nexus_last_seen_at,
      nowMs: now,
    });
    if (!source) continue;

    const id = profile?.id ?? row.discord_id;
    const username =
      profile?.display_name ||
      row.display_name ||
      `Player ${row.discord_id.slice(-4)}`;
    const avatarUrl =
      profile?.avatar_url || row.avatar_url || fallbackAvatar(row.discord_id);

    upsert({
      id,
      username,
      avatarUrl,
      gameTitle: source.label,
      platform: source.platform,
      sortAt: Date.parse(row.updated_at) || now,
    });
  }

  for (const profile of (nexusProfiles ?? []) as ProfileRow[]) {
    if (
      profile.discord_id &&
      PRESENCE_EXCLUDED_DISCORD_IDS.has(profile.discord_id)
    ) {
      continue;
    }

    const presence = profile.discord_id
      ? presenceByDiscord.get(profile.discord_id)
      : null;

    // In-game Discord users belong in Who's Playing, not Who's Online.
    if (presence?.activity_name) continue;

    const source = resolveOnlinePresence({
      discordStatus: presence?.status,
      activityName: presence?.activity_name,
      clientStatus: presence?.client_status,
      nexusLastSeenAt: profile.nexus_last_seen_at,
      nowMs: now,
    });
    if (!source) continue;

    upsert({
      id: profile.id,
      username: profile.display_name || `Player ${profile.id.slice(0, 4)}`,
      avatarUrl: profile.avatar_url || fallbackAvatar(profile.id),
      gameTitle: source.label,
      platform: source.platform,
      sortAt: Date.parse(profile.nexus_last_seen_at ?? "") || now,
    });
  }

  return Array.from(byId.values())
    .sort((a, b) => b.sortAt - a.sortAt)
    .slice(0, 24)
    .map(({ id, username, avatarUrl, gameTitle, platform }) => ({
      id,
      username,
      avatarUrl,
      gameTitle,
      platform,
    }));
}
