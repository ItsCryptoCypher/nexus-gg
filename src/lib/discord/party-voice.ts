const DISCORD_API = "https://discord.com/api/v10";

/** Guild voice channel type */
const CHANNEL_TYPE_GUILD_VOICE = 2;

type DiscordOverwrite = {
  id: string;
  type: 0 | 1;
  allow: string;
  deny: string;
};

function botAuth() {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!guildId || !botToken) {
    throw new Error("Missing DISCORD_GUILD_ID or DISCORD_BOT_TOKEN");
  }
  return { guildId, botToken };
}

async function discordFetch(
  path: string,
  botToken: string,
  init?: RequestInit,
) {
  const response = await fetch(`${DISCORD_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  return response;
}

/** Bit flags used for party VC access (Discord permission integers as strings). */
const Perms = {
  VIEW_CHANNEL: 1 << 10,
  CONNECT: 1 << 20,
  SPEAK: 1 << 21,
  STREAM: 1 << 9,
  MANAGE_CHANNELS: 1 << 4,
  MOVE_MEMBERS: 1 << 24,
};

function allowMember(): string {
  return String(
    Perms.VIEW_CHANNEL | Perms.CONNECT | Perms.SPEAK | Perms.STREAM,
  );
}

function allowBot(): string {
  return String(
    Perms.VIEW_CHANNEL |
      Perms.CONNECT |
      Perms.SPEAK |
      Perms.MANAGE_CHANNELS |
      Perms.MOVE_MEMBERS,
  );
}

function denyEveryone(): string {
  return String(Perms.VIEW_CHANNEL | Perms.CONNECT);
}

export async function createPartyVoiceChannel(options: {
  name: string;
  memberDiscordIds: string[];
  botUserId: string;
}): Promise<{ channelId: string }> {
  const { guildId, botToken } = botAuth();
  const categoryId = process.env.DISCORD_PARTY_CATEGORY_ID || undefined;

  const overwrites: DiscordOverwrite[] = [
    {
      id: guildId,
      type: 0,
      allow: "0",
      deny: denyEveryone(),
    },
    {
      id: options.botUserId,
      type: 1,
      allow: allowBot(),
      deny: "0",
    },
    ...options.memberDiscordIds.map(
      (id): DiscordOverwrite => ({
        id,
        type: 1,
        allow: allowMember(),
        deny: "0",
      }),
    ),
  ];

  const body: Record<string, unknown> = {
    name: options.name.slice(0, 100),
    type: CHANNEL_TYPE_GUILD_VOICE,
    permission_overwrites: overwrites,
    user_limit: Math.min(Math.max(options.memberDiscordIds.length + 2, 2), 99),
  };
  if (categoryId) body.parent_id = categoryId;

  const response = await discordFetch(`/guilds/${guildId}/channels`, botToken, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Create voice channel failed (${response.status}): ${detail}`);
  }

  const channel = (await response.json()) as { id: string };
  return { channelId: channel.id };
}

export async function createPartyVoiceInvite(channelId: string): Promise<{
  code: string;
  url: string;
}> {
  const { botToken } = botAuth();
  const response = await discordFetch(`/channels/${channelId}/invites`, botToken, {
    method: "POST",
    body: JSON.stringify({
      max_age: 0,
      max_uses: 0,
      unique: true,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Create invite failed (${response.status}): ${detail}`);
  }

  const invite = (await response.json()) as { code: string };
  return {
    code: invite.code,
    url: `https://discord.gg/${invite.code}`,
  };
}

export async function syncPartyVoiceOverwrites(options: {
  channelId: string;
  memberDiscordIds: string[];
  botUserId: string;
}): Promise<void> {
  const { guildId, botToken } = botAuth();

  const overwrites: DiscordOverwrite[] = [
    {
      id: guildId,
      type: 0,
      allow: "0",
      deny: denyEveryone(),
    },
    {
      id: options.botUserId,
      type: 1,
      allow: allowBot(),
      deny: "0",
    },
    ...options.memberDiscordIds.map(
      (id): DiscordOverwrite => ({
        id,
        type: 1,
        allow: allowMember(),
        deny: "0",
      }),
    ),
  ];

  const response = await discordFetch(`/channels/${options.channelId}`, botToken, {
    method: "PATCH",
    body: JSON.stringify({ permission_overwrites: overwrites }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Update overwrites failed (${response.status}): ${detail}`);
  }
}

export async function deletePartyVoiceChannel(channelId: string): Promise<void> {
  const { botToken } = botAuth();
  const response = await discordFetch(`/channels/${channelId}`, botToken, {
    method: "DELETE",
  });

  // 404 = already gone
  if (!response.ok && response.status !== 404) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Delete channel failed (${response.status}): ${detail}`);
  }
}

export async function fetchBotUserId(): Promise<string> {
  const { botToken } = botAuth();
  const response = await discordFetch("/users/@me", botToken);
  if (!response.ok) {
    throw new Error(`Failed to fetch bot user (${response.status})`);
  }
  const me = (await response.json()) as { id: string };
  return me.id;
}
