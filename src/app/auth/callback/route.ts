import { NextResponse } from "next/server";
import {
  addDiscordGuildMember,
  getDiscordUserIdFromAuthUser,
} from "@/lib/discord/add-guild-member";
import { fetchDiscordConnections } from "@/lib/discord/connections";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getSetupState,
  shouldShowSetup,
} from "@/lib/setup/get-setup-state";

function redirectTo(origin: string, request: Request, path: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${path}`);
  }
  if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${path}`);
  }
  return NextResponse.redirect(`${origin}${path}`);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/play";
  if (!next.startsWith("/")) {
    next = "/play";
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const providerToken = data.session.provider_token;
      const discordUserId = getDiscordUserIdFromAuthUser(data.session.user);
      const userId = data.session.user.id;

      if (providerToken && discordUserId) {
        const join = await addDiscordGuildMember({
          discordUserId,
          userAccessToken: providerToken,
        });
        if (!join.ok) {
          console.error("Discord guild join failed", join.status, join.detail);
        }

        try {
          const connections = await fetchDiscordConnections(providerToken);
          const admin = createAdminClient();
          await admin
            .from("profiles")
            .update({
              discord_connections: connections,
              discord_id: discordUserId,
              features_unlocked: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        } catch (err) {
          console.error("Failed to sync Discord connections", err);
        }
      } else {
        console.error(
          "Discord guild join skipped: missing provider_token or discord user id",
        );
      }

      const setupState = await getSetupState();
      if (shouldShowSetup(setupState) && !next.startsWith("/setup")) {
        return redirectTo(
          origin,
          request,
          `/setup?next=${encodeURIComponent(next)}`,
        );
      }

      return redirectTo(origin, request, next);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
