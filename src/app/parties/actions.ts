"use server";

import { revalidatePath } from "next/cache";
import {
  createPartyVoiceChannel,
  createPartyVoiceInvite,
  deletePartyVoiceChannel,
  fetchBotUserId,
  syncPartyVoiceOverwrites,
} from "@/lib/discord/party-voice";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=640&h=400&fit=crop";

function revalidateParties() {
  revalidatePath("/parties");
  revalidatePath("/play");
  revalidatePath("/friends");
}

async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId || typeof userId !== "string") {
    return { supabase, userId: null as string | null };
  }
  return { supabase, userId };
}

async function getDiscordId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data } = await supabase
    .from("profiles")
    .select("discord_id")
    .eq("id", userId)
    .maybeSingle();
  return data?.discord_id ?? null;
}

async function refreshChannelAccess(partyId: string, channelId: string) {
  const admin = createAdminClient();
  const { data: members } = await admin
    .from("game_party_members")
    .select("discord_id, status")
    .eq("party_id", partyId)
    .in("status", ["joined", "invited"]);

  const discordIds = (members ?? [])
    .map((m) => m.discord_id)
    .filter((id): id is string => Boolean(id));

  const botUserId = await fetchBotUserId();
  await syncPartyVoiceOverwrites({
    channelId,
    memberDiscordIds: discordIds,
    botUserId,
  });
}

export async function createGameParty(formData: FormData) {
  const { supabase, userId } = await requireUser();
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const gameTitle = String(formData.get("gameTitle") ?? "").trim() || "Game Night";
  const name =
    String(formData.get("name") ?? "").trim() || `${gameTitle} Party`;
  const description = String(formData.get("description") ?? "").trim() || null;
  const partyMax = Math.min(
    16,
    Math.max(2, Number(formData.get("partyMax") ?? 4) || 4),
  );

  const discordId = await getDiscordId(supabase, userId);
  if (!discordId) {
    return {
      ok: false as const,
      error: "Link Discord to create a game party (voice runs on Discord).",
    };
  }

  // One active party at a time
  const { data: existingRows } = await supabase
    .from("game_party_members")
    .select("party_id")
    .eq("user_id", userId)
    .eq("status", "joined");

  if (existingRows?.length) {
    const partyIds = existingRows.map((r) => r.party_id);
    const { data: activeParties } = await supabase
      .from("game_parties")
      .select("id")
      .in("id", partyIds)
      .eq("status", "active")
      .limit(1);
    if (activeParties?.length) {
      return {
        ok: false as const,
        error: "Leave your current party before creating a new one.",
      };
    }
  }

  const { data: party, error: partyError } = await supabase
    .from("game_parties")
    .insert({
      host_id: userId,
      name,
      game_title: gameTitle,
      description,
      party_max: partyMax,
      status: "provisioning",
      cover_url: FALLBACK_COVER,
    })
    .select("id")
    .single();

  if (partyError || !party) {
    return {
      ok: false as const,
      error: partyError?.message || "Could not create party.",
    };
  }

  const { error: memberError } = await supabase.from("game_party_members").insert({
    party_id: party.id,
    user_id: userId,
    discord_id: discordId,
    role: "host",
    status: "joined",
  });

  if (memberError) {
    await supabase.from("game_parties").update({ status: "ended" }).eq("id", party.id);
    return { ok: false as const, error: memberError.message };
  }

  try {
    const botUserId = await fetchBotUserId();
    const channelName = `party-${gameTitle}`.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 90);
    const { channelId } = await createPartyVoiceChannel({
      name: channelName || "nexus-party",
      memberDiscordIds: [discordId],
      botUserId,
    });
    const invite = await createPartyVoiceInvite(channelId);

    const { error: updateError } = await supabase
      .from("game_parties")
      .update({
        status: "active",
        discord_channel_id: channelId,
        discord_invite_url: invite.url,
        discord_invite_code: invite.code,
        updated_at: new Date().toISOString(),
      })
      .eq("id", party.id)
      .eq("host_id", userId);

    if (updateError) {
      await deletePartyVoiceChannel(channelId).catch(() => undefined);
      return { ok: false as const, error: updateError.message };
    }
  } catch (err) {
    await supabase
      .from("game_parties")
      .update({
        status: "ended",
        ended_at: new Date().toISOString(),
      })
      .eq("id", party.id);
    return {
      ok: false as const,
      error:
        err instanceof Error
          ? err.message
          : "Discord voice setup failed. Check bot permissions.",
    };
  }

  revalidateParties();
  return { ok: true as const, partyId: party.id };
}

export async function inviteFriendToParty(partyId: string, friendUserId: string) {
  const { supabase, userId } = await requireUser();
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const { data: party } = await supabase
    .from("game_parties")
    .select("id, host_id, status, discord_channel_id, party_max")
    .eq("id", partyId)
    .maybeSingle();

  if (!party || party.host_id !== userId || party.status !== "active") {
    return { ok: false as const, error: "Only the host can invite." };
  }

  const { count } = await supabase
    .from("game_party_members")
    .select("user_id", { count: "exact", head: true })
    .eq("party_id", partyId)
    .eq("status", "joined");

  if ((count ?? 0) >= (party.party_max as number)) {
    return { ok: false as const, error: "Party is full." };
  }

  const friendDiscordId = await getDiscordId(supabase, friendUserId);
  if (!friendDiscordId) {
    return {
      ok: false as const,
      error: "That friend needs Discord linked to join party voice.",
    };
  }

  const { error } = await supabase.from("game_party_members").upsert(
    {
      party_id: partyId,
      user_id: friendUserId,
      discord_id: friendDiscordId,
      role: "member",
      status: "invited",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "party_id,user_id" },
  );

  if (error) return { ok: false as const, error: error.message };

  if (party.discord_channel_id) {
    try {
      await refreshChannelAccess(partyId, party.discord_channel_id);
    } catch (err) {
      console.error("Failed to sync party overwrites", err);
    }
  }

  revalidateParties();
  return { ok: true as const };
}

export async function acceptPartyInvite(partyId: string) {
  const { supabase, userId } = await requireUser();
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const discordId = await getDiscordId(supabase, userId);

  const { data: membership } = await supabase
    .from("game_party_members")
    .select("party_id, status")
    .eq("party_id", partyId)
    .eq("user_id", userId)
    .eq("status", "invited")
    .maybeSingle();

  if (!membership) {
    return { ok: false as const, error: "Invite not found." };
  }

  // Leave any other active party first
  const { data: joinedRows } = await supabase
    .from("game_party_members")
    .select("party_id")
    .eq("user_id", userId)
    .eq("status", "joined");

  if (joinedRows?.length) {
    const { data: activeParties } = await supabase
      .from("game_parties")
      .select("id")
      .in(
        "id",
        joinedRows.map((r) => r.party_id),
      )
      .eq("status", "active");

    for (const row of activeParties ?? []) {
      if (row.id === partyId) continue;
      await supabase
        .from("game_party_members")
        .update({ status: "left", updated_at: new Date().toISOString() })
        .eq("party_id", row.id)
        .eq("user_id", userId);
    }
  }

  const { error } = await supabase
    .from("game_party_members")
    .update({
      status: "joined",
      discord_id: discordId,
      updated_at: new Date().toISOString(),
    })
    .eq("party_id", partyId)
    .eq("user_id", userId);

  if (error) return { ok: false as const, error: error.message };

  const { data: party } = await supabase
    .from("game_parties")
    .select("discord_channel_id")
    .eq("id", partyId)
    .maybeSingle();

  if (party?.discord_channel_id) {
    try {
      await refreshChannelAccess(partyId, party.discord_channel_id);
    } catch (err) {
      console.error("Failed to sync party overwrites", err);
    }
  }

  revalidateParties();
  return { ok: true as const };
}

export async function declinePartyInvite(partyId: string) {
  const { supabase, userId } = await requireUser();
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const { error } = await supabase
    .from("game_party_members")
    .update({ status: "left", updated_at: new Date().toISOString() })
    .eq("party_id", partyId)
    .eq("user_id", userId)
    .eq("status", "invited");

  if (error) return { ok: false as const, error: error.message };
  revalidateParties();
  return { ok: true as const };
}

export async function leaveGameParty(partyId: string) {
  const { supabase, userId } = await requireUser();
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const { data: party } = await supabase
    .from("game_parties")
    .select("id, host_id, status, discord_channel_id")
    .eq("id", partyId)
    .maybeSingle();

  if (!party || party.status === "ended") {
    return { ok: false as const, error: "Party not found." };
  }

  if (party.host_id === userId) {
    return endGameParty(partyId);
  }

  const { error } = await supabase
    .from("game_party_members")
    .update({
      status: "left",
      in_voice: false,
      updated_at: new Date().toISOString(),
    })
    .eq("party_id", partyId)
    .eq("user_id", userId);

  if (error) return { ok: false as const, error: error.message };

  if (party.discord_channel_id) {
    try {
      await refreshChannelAccess(partyId, party.discord_channel_id);
    } catch {
      /* ignore */
    }
  }

  revalidateParties();
  return { ok: true as const };
}

export async function endGameParty(partyId: string) {
  const { supabase, userId } = await requireUser();
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const { data: party } = await supabase
    .from("game_parties")
    .select("id, host_id, discord_channel_id, status")
    .eq("id", partyId)
    .maybeSingle();

  if (!party || party.host_id !== userId) {
    return { ok: false as const, error: "Only the host can end the party." };
  }

  const channelId = party.discord_channel_id;

  const { error } = await supabase
    .from("game_parties")
    .update({
      status: "ended",
      ended_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", partyId)
    .eq("host_id", userId);

  if (error) return { ok: false as const, error: error.message };

  await supabase
    .from("game_party_members")
    .update({
      status: "left",
      in_voice: false,
      updated_at: new Date().toISOString(),
    })
    .eq("party_id", partyId)
    .neq("status", "left");

  if (channelId) {
    try {
      await deletePartyVoiceChannel(channelId);
    } catch (err) {
      console.error("Failed to delete party VC", err);
    }
  }

  revalidateParties();
  return { ok: true as const };
}
