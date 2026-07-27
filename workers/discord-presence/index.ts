import { resolve } from "node:path";
import dotenv from "dotenv";
import {
  ActivityType,
  Client,
  GatewayIntentBits,
  type Activity,
  type Presence,
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
  const raw = activity as Activity & {
    platform?: string;
    // Some gateway payloads nest platform under flags / assets historically
    details?: string | null;
  };
  if (typeof raw.platform === "string" && raw.platform.length > 0) {
    return raw.platform;
  }
  // Fallback: inspect toJSON() in case discord.js hides undeclared fields
  try {
    const json = activity.toJSON() as { platform?: string };
    if (typeof json.platform === "string" && json.platform.length > 0) {
      return json.platform;
    }
  } catch {
    /* ignore */
  }
  return null;
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

client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  try {
    await syncGuildSnapshot();
  } catch (err) {
    console.error("Initial sync failed", err);
  }
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

client.login(token);
