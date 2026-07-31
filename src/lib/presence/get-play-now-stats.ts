import type { StatItem } from "@/data/mock";
import { createClient } from "@/lib/supabase/server";

/** Count users currently joined to an active game party. */
export async function countPeopleInParties(): Promise<number> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    return 0;
  }

  const { data: parties, error: partiesError } = await supabase
    .from("game_parties")
    .select("id")
    .eq("status", "active");

  if (partiesError || !parties?.length) {
    return 0;
  }

  const { count, error } = await supabase
    .from("game_party_members")
    .select("user_id", { count: "exact", head: true })
    .in(
      "party_id",
      parties.map((party) => party.id),
    )
    .eq("status", "joined");

  if (error) {
    return 0;
  }

  return count ?? 0;
}

/** Live Play Now top stats. Looking to Play stays 0 until LFG ships. */
export function buildPlayNowStats(options: {
  onlineCount: number;
  inGameCount: number;
  inPartyCount: number;
}): StatItem[] {
  return [
    {
      id: "online",
      label: "Online",
      value: options.onlineCount,
      tone: "green",
      icon: "activity",
    },
    {
      id: "in-game",
      label: "In Game",
      value: options.inGameCount,
      tone: "purple",
      icon: "gamepad",
    },
    {
      id: "in-party",
      label: "In Party",
      value: options.inPartyCount,
      tone: "blue",
      icon: "users",
    },
    {
      id: "looking",
      label: "Looking to Play",
      value: 0,
      tone: "orange",
      icon: "headset",
    },
  ];
}
