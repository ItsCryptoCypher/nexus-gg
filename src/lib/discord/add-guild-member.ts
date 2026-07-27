/**
 * Adds a Discord user to the Nexus guild using OAuth guilds.join + bot token.
 * @see https://discord.com/developers/docs/resources/guild#add-guild-member
 */
export async function addDiscordGuildMember(options: {
  discordUserId: string;
  userAccessToken: string;
}): Promise<{ ok: boolean; status: number; detail?: string }> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken) {
    return { ok: false, status: 0, detail: "Missing DISCORD_GUILD_ID or DISCORD_BOT_TOKEN" };
  }

  const response = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members/${options.discordUserId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: options.userAccessToken,
      }),
    },
  );

  // 201 created, 204 already a member
  if (response.status === 201 || response.status === 204) {
    return { ok: true, status: response.status };
  }

  const detail = await response.text().catch(() => "");
  return { ok: false, status: response.status, detail };
}

export function getDiscordUserIdFromAuthUser(user: {
  user_metadata?: Record<string, unknown> | null;
  identities?: Array<{ provider: string; id: string; identity_data?: Record<string, unknown> }> | null;
}): string | null {
  const meta = user.user_metadata ?? {};
  const fromMeta =
    (typeof meta.provider_id === "string" && meta.provider_id) ||
    (typeof meta.sub === "string" && meta.sub) ||
    null;

  if (fromMeta) return fromMeta;

  const identity = user.identities?.find((i) => i.provider === "discord");
  if (!identity) return null;

  const fromIdentityData = identity.identity_data?.provider_id;
  if (typeof fromIdentityData === "string") return fromIdentityData;

  return identity.id || null;
}
