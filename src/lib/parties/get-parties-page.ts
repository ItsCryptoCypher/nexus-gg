import type {
  FriendInParty,
  LiveNowItem,
  OpenParty,
  PartyInvite,
  StatItem,
  YourParty,
} from "@/data/mock";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=640&h=400&fit=crop";

export type LiveYourParty = YourParty & {
  isHost: boolean;
  discordInviteUrl: string | null;
  voiceReady: boolean;
  memberCount: number;
  inVoiceCount: number;
};

export type LivePartyInvite = PartyInvite & {
  partyId: string;
  hostId: string;
};

export type PartiesPageData = {
  stats: StatItem[];
  yourParty: LiveYourParty | null;
  openParties: OpenParty[];
  partyInvites: LivePartyInvite[];
  friendsInParties: FriendInParty[];
  liveNow: LiveNowItem[];
  nexusFriendOptions: { id: string; username: string; avatarUrl: string }[];
};

function emptyStats(): StatItem[] {
  return [
    {
      id: "active-parties",
      label: "Active Parties",
      value: 0,
      tone: "purple",
      icon: "party",
    },
    {
      id: "friends-in-parties",
      label: "Friends in Parties",
      value: 0,
      tone: "blue",
      icon: "users",
    },
    {
      id: "joinable-parties",
      label: "Joinable Parties",
      value: 0,
      tone: "green",
      icon: "users",
    },
    {
      id: "invites",
      label: "Party Invites",
      value: 0,
      tone: "orange",
      icon: "mail",
    },
  ];
}

export async function getPartiesPageData(): Promise<PartiesPageData> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const me = claims?.claims?.sub;

  if (!me || typeof me !== "string") {
    return {
      stats: emptyStats(),
      yourParty: null,
      openParties: [],
      partyInvites: [],
      friendsInParties: [],
      liveNow: [],
      nexusFriendOptions: [],
    };
  }

  const { data: memberships } = await supabase
    .from("game_party_members")
    .select("party_id, status, role, in_voice")
    .eq("user_id", me)
    .in("status", ["joined", "invited"]);

  const joined = (memberships ?? []).filter((m) => m.status === "joined");
  const invited = (memberships ?? []).filter((m) => m.status === "invited");

  let yourParty: LiveYourParty | null = null;

  if (joined.length) {
    const partyId = joined[0].party_id as string;
    const { data: party } = await supabase
      .from("game_parties")
      .select(
        "id, host_id, name, game_title, description, party_max, status, discord_invite_url, cover_url",
      )
      .eq("id", partyId)
      .neq("status", "ended")
      .maybeSingle();

    if (party) {
      const { data: members } = await supabase
        .from("game_party_members")
        .select("user_id, status, in_voice, role")
        .eq("party_id", party.id)
        .eq("status", "joined");

      const memberIds = (members ?? []).map((m) => m.user_id as string);
      const { data: profiles } = memberIds.length
        ? await supabase
            .from("profiles")
            .select("id, display_name, avatar_url")
            .in("id", memberIds)
        : { data: [] };

      const profileById = new Map(
        (profiles ?? []).map((p) => [p.id as string, p]),
      );
      const memberRows = (members ?? []).map((m) => {
        const profile = profileById.get(m.user_id as string);
        return {
          id: m.user_id as string,
          username: profile?.display_name || "Player",
          avatarUrl:
            profile?.avatar_url ||
            "https://cdn.discordapp.com/embed/avatars/0.png",
          inVoice: Boolean(m.in_voice),
        };
      });

      const memberCount = memberRows.length;
      const inVoiceCount = memberRows.filter((m) => m.inVoice).length;

      yourParty = {
        id: party.id,
        name: party.name,
        gameTitle: party.game_title,
        coverUrl: party.cover_url || FALLBACK_COVER,
        description:
          party.description ||
          "Discord hosts party voice — join from PC or console Discord.",
        tags: ["Cross-Play", "Discord Voice", "Mic On"],
        platforms: ["discord", "xbox", "playstation", "steam"],
        members: memberRows.map(({ id, username, avatarUrl }) => ({
          id,
          username,
          avatarUrl,
        })),
        extraMembers: 0,
        openSlots: Math.max(0, (party.party_max as number) - memberCount),
        partyMax: party.party_max as number,
        readyStatus:
          inVoiceCount > 0
            ? `${inVoiceCount} in Discord voice`
            : party.status === "active"
              ? "Voice ready — join Discord"
              : "Setting up voice…",
        isHost: party.host_id === me,
        discordInviteUrl: party.discord_invite_url,
        voiceReady: Boolean(party.discord_invite_url) && party.status === "active",
        memberCount,
        inVoiceCount,
      };
    }
  }

  const partyInvites: LivePartyInvite[] = [];
  for (const row of invited) {
    const { data: party } = await supabase
      .from("game_parties")
      .select("id, host_id, game_title, status")
      .eq("id", row.party_id)
      .eq("status", "active")
      .maybeSingle();
    if (!party) continue;

    const { data: host } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", party.host_id)
      .maybeSingle();

    partyInvites.push({
      id: party.id,
      partyId: party.id,
      hostId: party.host_id,
      username: host?.display_name || "Host",
      avatarUrl:
        host?.avatar_url || "https://cdn.discordapp.com/embed/avatars/0.png",
      gameTitle: party.game_title,
    });
  }

  // Nexus friends for invite picker
  const { data: friendships } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id, status")
    .eq("status", "accepted")
    .or(`requester_id.eq.${me},addressee_id.eq.${me}`);

  const friendIds = (friendships ?? []).map((f) =>
    f.requester_id === me ? f.addressee_id : f.requester_id,
  ) as string[];

  const { data: friendProfiles } = friendIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", friendIds)
    : { data: [] };

  const inPartyIds = new Set(yourParty?.members.map((m) => m.id) ?? []);
  const nexusFriendOptions = (friendProfiles ?? [])
    .filter((p) => !inPartyIds.has(p.id as string))
    .map((p) => ({
      id: p.id as string,
      username: p.display_name || "Friend",
      avatarUrl:
        p.avatar_url || "https://cdn.discordapp.com/embed/avatars/0.png",
    }));

  const { count: activeCount } = await supabase
    .from("game_parties")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  const stats = emptyStats();
  stats[0].value = activeCount ?? 0;
  stats[3].value = partyInvites.length;
  if (yourParty) {
    stats[1].value = Math.max(0, yourParty.memberCount - 1);
  }

  return {
    stats,
    yourParty,
    openParties: [],
    partyInvites,
    friendsInParties: [],
    liveNow: [],
    nexusFriendOptions,
  };
}
