export type DiscordConnection = {
  id: string;
  name: string;
  type: string;
  verified: boolean;
  visibility: number;
};

const GAMING_TYPES = new Set([
  "steam",
  "xbox",
  "playstation",
  "epicgames",
  "battlenet",
  "riotgames",
  "leagueoflegends",
]);

export const SETUP_PLATFORMS = [
  {
    type: "steam",
    label: "Steam",
    blurb: "Best for PC game activity",
  },
  {
    type: "xbox",
    label: "Xbox",
    blurb: "Xbox consoles & Game Pass PC",
  },
  {
    type: "playstation",
    label: "PlayStation",
    blurb: "PS4 / PS5 activity via Discord",
  },
] as const;

export async function fetchDiscordConnections(
  userAccessToken: string,
): Promise<DiscordConnection[]> {
  const response = await fetch("https://discord.com/api/v10/users/@me/connections", {
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Discord connections fetch failed", response.status, detail);
    return [];
  }

  const data = (await response.json()) as DiscordConnection[];
  return data.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    verified: Boolean(c.verified),
    visibility: c.visibility,
  }));
}

export function hasGamingConnection(
  connections: DiscordConnection[] | null | undefined,
): boolean {
  if (!connections?.length) return false;
  return connections.some((c) => GAMING_TYPES.has(c.type));
}

export function connectionTypes(
  connections: DiscordConnection[] | null | undefined,
): Set<string> {
  return new Set((connections ?? []).map((c) => c.type));
}
