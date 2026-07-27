import type {
  FriendRequest,
  ImportedPlatform,
  NexusFriend,
  OnlineFriend,
  PlatformContact,
  StatItem,
  SuggestedFriend,
} from "@/data/mock";
import type { DiscordConnection } from "@/lib/discord/connections";
import {
  mapFriendPlatforms,
  mapFriendPresence,
  mapConnectionPlatform,
  type PresenceSnippet,
} from "@/lib/friends/map-presence";
import { resolvePlayingPlatform } from "@/lib/presence/resolve-platform";
import { createClient } from "@/lib/supabase/server";

type FriendshipRow = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  discord_id: string | null;
  discord_connections: DiscordConnection[] | null;
};

type PresenceRow = PresenceSnippet & {
  discord_id: string;
  user_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type MutualFriendRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
};

export type FriendsPageData = {
  stats: StatItem[];
  nexusFriends: NexusFriend[];
  nexusCount: number;
  platformContacts: PlatformContact[];
  platformCount: number;
  suggestions: SuggestedFriend[];
  requests: FriendRequest[];
  requestCount: number;
  onlineFriends: OnlineFriend[];
  onlineCount: number;
  platforms: ImportedPlatform[];
};

const empty: FriendsPageData = {
  stats: [
    {
      id: "nexus-friends",
      label: "Nexus Friends",
      value: 0,
      tone: "purple",
      icon: "users",
      hint: "Your inner circle",
    },
    {
      id: "platform-contacts",
      label: "Platform Contacts",
      value: 0,
      tone: "blue",
      icon: "users",
      hint: "From connected platforms",
    },
    {
      id: "online-now",
      label: "Online Now",
      value: 0,
      tone: "green",
      icon: "activity",
      hint: "Across all platforms",
    },
    {
      id: "pending-requests",
      label: "Pending Requests",
      value: 0,
      tone: "orange",
      icon: "user-plus",
      hint: "From friends & contacts",
    },
  ],
  nexusFriends: [],
  nexusCount: 0,
  platformContacts: [],
  platformCount: 0,
  suggestions: [],
  requests: [],
  requestCount: 0,
  onlineFriends: [],
  onlineCount: 0,
  platforms: [],
};

function displayName(profile: ProfileRow, presence?: PresenceRow | null) {
  return (
    profile.display_name ||
    presence?.display_name ||
    `Player ${profile.id.slice(0, 4)}`
  );
}

function avatarUrl(profile: ProfileRow, presence?: PresenceRow | null) {
  return (
    profile.avatar_url ||
    presence?.avatar_url ||
    `https://cdn.discordapp.com/embed/avatars/${Number(profile.id.replace(/\D/g, "").slice(-2) || 0) % 6}.png`
  );
}

function otherUserId(row: FriendshipRow, me: string) {
  return row.requester_id === me ? row.addressee_id : row.requester_id;
}

async function mutualCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  otherUserId: string,
) {
  const { data, error } = await supabase.rpc("mutual_friend_count", {
    other_user: otherUserId,
  });
  if (error || typeof data !== "number") return 0;
  return data;
}

async function mutualFriends(
  supabase: Awaited<ReturnType<typeof createClient>>,
  otherUserId: string,
) {
  const { data, error } = await supabase.rpc("get_mutual_friends", {
    other_user: otherUserId,
    lim: 3,
  });
  if (error || !data) return [] as MutualFriendRow[];
  return data as MutualFriendRow[];
}

/** Load Friends tab data for the signed-in user. */
export async function getFriendsPageData(): Promise<FriendsPageData> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const me = claims?.claims?.sub;
  if (!me || typeof me !== "string") {
    return empty;
  }

  const [{ data: myProfile }, { data: friendshipRows }, { data: profiles }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, display_name, avatar_url, discord_id, discord_connections")
        .eq("id", me)
        .maybeSingle(),
      supabase
        .from("friendships")
        .select("id, requester_id, addressee_id, status")
        .or(`requester_id.eq.${me},addressee_id.eq.${me}`),
      supabase
        .from("profiles")
        .select("id, display_name, avatar_url, discord_id, discord_connections")
        .neq("id", me)
        .not("discord_id", "is", null)
        .limit(80),
    ]);

  const friendships = (friendshipRows ?? []) as FriendshipRow[];
  const allProfiles = (profiles ?? []) as ProfileRow[];
  const profileById = new Map(allProfiles.map((p) => [p.id, p]));

  const accepted = friendships.filter((f) => f.status === "accepted");
  const pendingIncoming = friendships.filter(
    (f) => f.status === "pending" && f.addressee_id === me,
  );
  const pendingOutgoing = friendships.filter(
    (f) => f.status === "pending" && f.requester_id === me,
  );

  const friendIds = new Set(accepted.map((f) => otherUserId(f, me)));
  const pendingEither = new Set(
    [...pendingIncoming, ...pendingOutgoing].map((f) => otherUserId(f, me)),
  );
  const relatedIds = new Set([...friendIds, ...pendingEither]);

  // Ensure friend profiles are loaded even if filter missed them
  const missingFriendIds = [...friendIds].filter((id) => !profileById.has(id));
  if (missingFriendIds.length) {
    const { data: extra } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, discord_id, discord_connections")
      .in("id", missingFriendIds);
    for (const row of (extra ?? []) as ProfileRow[]) {
      profileById.set(row.id, row);
      allProfiles.push(row);
    }
  }

  const discordIds = allProfiles
    .map((p) => p.discord_id)
    .filter((id): id is string => Boolean(id));

  const { data: presenceRows } = discordIds.length
    ? await supabase
        .from("player_presence")
        .select(
          "discord_id, user_id, status, activity_name, activity_platform, client_status, display_name, avatar_url",
        )
        .in("discord_id", discordIds)
    : { data: [] as PresenceRow[] };

  const presenceByDiscord = new Map(
    ((presenceRows ?? []) as PresenceRow[]).map((row) => [row.discord_id, row]),
  );

  const nexusFriends: NexusFriend[] = [];
  for (const f of accepted) {
    const friendId = otherUserId(f, me);
    const profile = profileById.get(friendId);
    if (!profile) continue;
    const presence = profile.discord_id
      ? presenceByDiscord.get(profile.discord_id)
      : null;
    nexusFriends.push({
      id: friendId,
      username: displayName(profile, presence),
      avatarUrl: avatarUrl(profile, presence),
      status: mapFriendPresence(presence),
      gameTitle: presence?.activity_name ?? null,
      gameIconUrl: null,
      platforms: mapFriendPlatforms({
        presence,
        connections: profile.discord_connections,
      }),
    });
  }
  nexusFriends.sort((a, b) => {
    const rank = { "in-game": 0, "in-party": 1, online: 2, away: 3, offline: 4 };
    return rank[a.status] - rank[b.status];
  });

  const contactCandidates = allProfiles.filter(
    (p) => !friendIds.has(p.id) && !pendingIncoming.some((f) => otherUserId(f, me) === p.id),
  );

  const platformContacts: PlatformContact[] = [];
  for (const profile of contactCandidates.slice(0, 24)) {
    const presence = profile.discord_id
      ? presenceByDiscord.get(profile.discord_id)
      : null;
    const mutuals = await mutualFriends(supabase, profile.id);
    const count = await mutualCount(supabase, profile.id);
    const outgoing = pendingOutgoing.find((f) => otherUserId(f, me) === profile.id);

    platformContacts.push({
      id: profile.id,
      username: displayName(profile, presence),
      avatarUrl: avatarUrl(profile, presence),
      sourcePlatform: "discord",
      status: mapFriendPresence(presence),
      gameTitle: presence?.activity_name ?? null,
      mutualFriends: mutuals.map((m) => ({
        id: m.id,
        username: m.display_name || "Friend",
        avatarUrl:
          m.avatar_url ||
          `https://cdn.discordapp.com/embed/avatars/0.png`,
      })),
      mutualCount: count,
      requestPending: Boolean(outgoing),
    });
  }

  // Suggestions: people not already shown as contacts / friends / pending
  const shownContactIds = new Set(platformContacts.map((c) => c.id));
  const suggestionPool = allProfiles
    .filter((p) => !relatedIds.has(p.id) && !shownContactIds.has(p.id))
    .slice(0, 8);

  const suggestions: SuggestedFriend[] = [];
  for (const profile of suggestionPool) {
    const presence = profile.discord_id
      ? presenceByDiscord.get(profile.discord_id)
      : null;
    const count = await mutualCount(supabase, profile.id);
    suggestions.push({
      id: profile.id,
      username: displayName(profile, presence),
      avatarUrl: avatarUrl(profile, presence),
      mutualCount: count,
      recentGames: presence?.activity_name || "On Nexus Discord",
    });
  }

  const requests: FriendRequest[] = [];
  for (const row of pendingIncoming) {
    const profile = profileById.get(row.requester_id);
    if (!profile) {
      const { data: requester } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, discord_id, discord_connections")
        .eq("id", row.requester_id)
        .maybeSingle();
      if (!requester) continue;
      profileById.set(requester.id, requester as ProfileRow);
    }
    const requester = profileById.get(row.requester_id)!;
    const presence = requester.discord_id
      ? presenceByDiscord.get(requester.discord_id)
      : null;
    const count = await mutualCount(supabase, requester.id);
    requests.push({
      id: row.id,
      userId: requester.id,
      username: displayName(requester, presence),
      avatarUrl: avatarUrl(requester, presence),
      mutualCount: count,
    });
  }

  const onlineFriends: OnlineFriend[] = nexusFriends
    .filter((f) => f.status !== "offline")
    .slice(0, 12)
    .map((f) => {
      const profile = profileById.get(f.id);
      const presence = profile?.discord_id
        ? presenceByDiscord.get(profile.discord_id)
        : null;
      const platform = resolvePlayingPlatform({
        inGame: Boolean(presence?.activity_name),
        activityPlatform: presence?.activity_platform,
        clientStatus: presence?.client_status,
        connections: profile?.discord_connections,
      });
      return {
        id: f.id,
        username: f.username,
        avatarUrl: f.avatarUrl,
        gameTitle: f.gameTitle,
        platform,
      };
    });

  const connections =
    ((myProfile as ProfileRow | null)?.discord_connections as
      | DiscordConnection[]
      | null) ?? [];

  const platforms: ImportedPlatform[] = [
    {
      id: "discord",
      label: "Discord",
      platform: "discord",
      connected: Boolean((myProfile as ProfileRow | null)?.discord_id),
    },
  ];

  for (const type of ["xbox", "steam", "playstation"] as const) {
    const match = connections.find((c) => c.type === type);
    const platform = mapConnectionPlatform(type);
    if (!platform) continue;
    platforms.push({
      id: type,
      label:
        type === "xbox"
          ? "Xbox Live"
          : type === "steam"
            ? "Steam"
            : "PlayStation Network",
      platform,
      connected: Boolean(match),
    });
  }

  const nexusCount = nexusFriends.length;
  const platformCount = platformContacts.length;
  const onlineCount = onlineFriends.length;
  const requestCount = requests.length;

  return {
    stats: [
      {
        id: "nexus-friends",
        label: "Nexus Friends",
        value: nexusCount,
        tone: "purple",
        icon: "users",
        hint: "Your inner circle",
      },
      {
        id: "platform-contacts",
        label: "Platform Contacts",
        value: platformCount,
        tone: "blue",
        icon: "users",
        hint: "From Discord & Nexus",
      },
      {
        id: "online-now",
        label: "Online Now",
        value: onlineCount,
        tone: "green",
        icon: "activity",
        hint: "Your Nexus friends",
      },
      {
        id: "pending-requests",
        label: "Pending Requests",
        value: requestCount,
        tone: "orange",
        icon: "user-plus",
        hint: "Awaiting your response",
      },
    ],
    nexusFriends,
    nexusCount,
    platformContacts,
    platformCount,
    suggestions,
    requests,
    requestCount,
    onlineFriends,
    onlineCount,
    platforms,
  };
}
