import { createClient } from "@/lib/supabase/server";
import type { CurrentUser } from "@/data/mock";

const guestUser: CurrentUser = {
  username: "Guest",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
  status: "online",
  level: 1,
  xp: 0,
  xpMax: 1000,
};

/** Signed-in profile for app chrome; guest fallback when logged out. */
export async function getAppUser(): Promise<CurrentUser> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId || typeof userId !== "string") {
    return guestUser;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    const metaName = claimsData.claims?.user_metadata as
      | { full_name?: string; name?: string; preferred_username?: string }
      | undefined;
    const metaAvatar = (
      claimsData.claims?.user_metadata as { avatar_url?: string } | undefined
    )?.avatar_url;

    return {
      username:
        metaName?.full_name ||
        metaName?.name ||
        metaName?.preferred_username ||
        "Player",
      avatarUrl: metaAvatar || guestUser.avatarUrl,
      status: "online",
      level: 1,
      xp: 0,
      xpMax: 1000,
    };
  }

  return {
    username: profile.display_name || "Player",
    avatarUrl: profile.avatar_url || guestUser.avatarUrl,
    status: "online",
    level: 1,
    xp: 0,
    xpMax: 1000,
  };
}
