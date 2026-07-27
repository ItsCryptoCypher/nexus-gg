import { createClient } from "@/lib/supabase/server";
import {
  connectionTypes,
  hasGamingConnection,
  type DiscordConnection,
} from "@/lib/discord/connections";

export type SetupState = {
  signedIn: boolean;
  discordLinked: boolean;
  displayName: string | null;
  connections: DiscordConnection[];
  linkedPlatforms: Set<string>;
  hasGamingPlatform: boolean;
  activityConfirmed: boolean;
  activityDetected: boolean;
  setupComplete: boolean;
  setupDismissed: boolean;
};

export async function getSetupState(): Promise<SetupState> {
  const empty: SetupState = {
    signedIn: false,
    discordLinked: false,
    displayName: null,
    connections: [],
    linkedPlatforms: new Set(),
    hasGamingPlatform: false,
    activityConfirmed: false,
    activityDetected: false,
    setupComplete: false,
    setupDismissed: false,
  };

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId || typeof userId !== "string") {
    return empty;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "display_name, discord_id, features_unlocked, discord_connections, activity_status_confirmed, setup_dismissed_at",
    )
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    return { ...empty, signedIn: true };
  }

  const connections = (profile.discord_connections ??
    []) as DiscordConnection[];
  const linkedPlatforms = connectionTypes(connections);
  const hasGamingPlatform = hasGamingConnection(connections);
  const discordLinked = Boolean(
    profile.discord_id || profile.features_unlocked,
  );

  let activityDetected = false;
  if (profile.discord_id) {
    const { data: presence } = await supabase
      .from("player_presence")
      .select("activity_name")
      .eq("discord_id", profile.discord_id)
      .maybeSingle();
    activityDetected = Boolean(presence?.activity_name);
  }

  const activityConfirmed =
    Boolean(profile.activity_status_confirmed) || activityDetected;
  const setupDismissed = Boolean(profile.setup_dismissed_at);
  const setupComplete =
    discordLinked && hasGamingPlatform && activityConfirmed;

  return {
    signedIn: true,
    discordLinked,
    displayName: profile.display_name,
    connections,
    linkedPlatforms,
    hasGamingPlatform,
    activityConfirmed,
    activityDetected,
    setupComplete,
    setupDismissed,
  };
}

export function shouldShowSetup(state: SetupState): boolean {
  if (!state.signedIn || !state.discordLinked) return false;
  if (state.setupComplete || state.setupDismissed) return false;
  return true;
}
