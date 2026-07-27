import { resolve } from "node:path";
import dotenv from "dotenv";
import {
  ActivityType,
  ChannelType,
  Client,
  GatewayIntentBits,
  type Activity,
  type Presence,
  type VoiceState,
} from "discord.js";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!token || !guildId || !supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env. Need DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

function pickActivity(activities: readonly Activity[] | undefined) {
  if (!activities?.length) return null;

  const playable = activities.find(
    (a) =>
      a.type === ActivityType.Playing ||
      a.type === ActivityType.Competing ||
      a.type === ActivityType.Streaming,
  );

  return playable ?? activities.find((a) => a.type !== ActivityType.Custom) ?? null;
}

/** Discord may send activity.platform (xbox / ps5 / desktop); discord.js types omit it. */
function getActivityPlatform(activity: Activity | null): string | null {
  if (!activity) return null;
  const raw = activity as Activity & { platform?: string };
  return typeof raw.platform === "string" && raw.platform.length > 0
    ? raw.platform
    : null;
}

async function upsertPresence(presence: Presence) {
  const discordId = presence.userId;
  if (!discordId) return;

  const status = presence.status ?? "offline";
  const activity = pickActivity(presence.activities);

  const user =
    presence.user ??
    presence.member?.user ??
    (await client.users.fetch(discordId).catch(() => null));

  const displayName =
    presence.member?.displayName ||
    user?.globalName ||
    user?.username ||
    null;
  const avatarUrl = user?.displayAvatarURL({ size: 128 }) ?? null;

  const activityPlatform = getActivityPlatform(activity);

  if (!activity && presence.activities?.length) {
    console.log(
      `presence ${discordId}: unhandled activities`,
      presence.activities.map((a) => ({
        type: a.type,
        name: a.name,
        platform: getActivityPlatform(a),
      })),
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("discord_id", discordId)
    .maybeSingle();

  const { error } = await supabase.from("player_presence").upsert(
    {
      discord_id: discordId,
      user_id: profile?.id ?? null,
      display_name: displayName,
      avatar_url: avatarUrl,
      status,
      activity_name: activity?.name ?? null,
      activity_type: activity?.type ?? null,
      activity_state: activity?.state ?? null,
      activity_platform: activityPlatform,
      client_status: presence.clientStatus ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "discord_id" },
  );

  if (error) {
    console.error("Failed to upsert presence", discordId, error.message);
    return;
  }

  const label = activity?.name
    ? `playing ${activity.name}${activityPlatform ? ` @ ${activityPlatform}` : ""}`
    : status;
  console.log(`presence ${discordId}: ${label}${displayName ? ` (${displayName})` : ""}`);
}

async function syncGuildSnapshot() {
  const guild = await client.guilds.fetch(guildId!);
  await guild.members.fetch();

  let count = 0;
  for (const member of guild.members.cache.values()) {
    if (member.user.bot) continue;
    if (member.presence) {
      await upsertPresence(member.presence);
      count += 1;
    } else {
      await supabase.from("player_presence").upsert(
        {
          discord_id: member.id,
          status: "offline",
          activity_name: null,
          activity_type: null,
          activity_state: null,
          activity_platform: null,
          client_status: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "discord_id" },
      );
    }
  }

  console.log(`Synced snapshot for ${guild.memberCount} members (${count} with presence)`);
}

async function setMemberInVoice(
  discordUserId: string,
  channelId: string | null,
  inVoice: boolean,
) {
  if (!channelId) return;

  const { data: party } = await supabase
    .from("game_parties")
    .select("id")
    .eq("discord_channel_id", channelId)
    .eq("status", "active")
    .maybeSingle();

  if (!party) return;

  const { error } = await supabase
    .from("game_party_members")
    .update({
      in_voice: inVoice,
      updated_at: new Date().toISOString(),
    })
    .eq("party_id", party.id)
    .eq("discord_id", discordUserId)
    .in("status", ["joined", "invited"]);

  if (error) {
    console.error("Failed to update in_voice", discordUserId, error.message);
    return;
  }

  console.log(
    `party voice ${discordUserId}: ${inVoice ? "joined" : "left"} ${channelId}`,
  );
}

async function handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
  if (newState.guild.id !== guildId && oldState.guild.id !== guildId) return;
  const userId = newState.id || oldState.id;
  if (!userId) return;
  if (newState.member?.user.bot || oldState.member?.user.bot) return;

  const oldChannel = oldState.channelId;
  const newChannel = newState.channelId;

  if (oldChannel === newChannel) return;

  if (oldChannel) {
    await setMemberInVoice(userId, oldChannel, false);
  }
  if (newChannel) {
    await setMemberInVoice(userId, newChannel, true);
  }
}

async function deletePartyChannel(channelId: string, reason: string) {
  const guild = await client.guilds.fetch(guildId!);
  try {
    const channel = await guild.channels.fetch(channelId).catch(() => null);
    if (channel && channel.type === ChannelType.GuildVoice) {
      await channel.delete(reason);
      console.log(`Deleted party VC ${channelId} (${reason})`);
    }
  } catch (err) {
    console.error("Failed deleting party VC", channelId, err);
  }
}

/** End active parties that have zero joined members (orphaned hosts). */
async function cleanupOrphanActiveParties() {
  const { data: active } = await supabase
    .from("game_parties")
    .select("id, discord_channel_id")
    .eq("status", "active")
    .limit(50);

  for (const party of active ?? []) {
    const { count } = await supabase
      .from("game_party_members")
      .select("user_id", { count: "exact", head: true })
      .eq("party_id", party.id)
      .eq("status", "joined");

    if ((count ?? 0) > 0) continue;

    console.log(`Ending orphan active party ${party.id}`);
    await supabase
      .from("game_parties")
      .update({
        status: "ended",
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", party.id);

    await supabase
      .from("game_party_members")
      .update({
        status: "left",
        in_voice: false,
        updated_at: new Date().toISOString(),
      })
      .eq("party_id", party.id)
      .neq("status", "left");

    if (party.discord_channel_id) {
      await deletePartyChannel(
        party.discord_channel_id,
        "Nexus orphan party cleanup",
      );
      await supabase
        .from("game_parties")
        .update({
          discord_channel_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", party.id);
    }
  }
}

/** Delete Discord VCs for ended parties; clear stale channel ids. */
async function cleanupEndedPartyChannels() {
  const { data: ended } = await supabase
    .from("game_parties")
    .select("id, discord_channel_id")
    .eq("status", "ended")
    .not("discord_channel_id", "is", null)
    .limit(20);

  if (!ended?.length) return;

  for (const party of ended) {
    const channelId = party.discord_channel_id;
    if (!channelId) continue;
    await deletePartyChannel(channelId, "Nexus party ended");

    await supabase
      .from("game_parties")
      .update({
        discord_channel_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", party.id);
  }
}

client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  try {
    await syncGuildSnapshot();
    await cleanupOrphanActiveParties();
    await cleanupEndedPartyChannels();
  } catch (err) {
    console.error("Initial sync failed", err);
  }

  setInterval(() => {
    Promise.all([cleanupOrphanActiveParties(), cleanupEndedPartyChannels()]).catch(
      (err) => console.error("Party cleanup failed", err),
    );
  }, 60_000);
});

client.on("presenceUpdate", async (_oldPresence, newPresence) => {
  if (newPresence.guild?.id !== guildId) return;
  if (newPresence.user?.bot) return;
  await upsertPresence(newPresence);
});

client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== guildId || member.user.bot) return;
  if (member.presence) {
    await upsertPresence(member.presence);
  }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  await handleVoiceStateUpdate(oldState, newState);
});

client.login(token);
