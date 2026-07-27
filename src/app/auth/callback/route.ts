import { NextResponse } from "next/server";
import {
  addDiscordGuildMember,
  getDiscordUserIdFromAuthUser,
} from "@/lib/discord/add-guild-member";
import { createClient } from "@/lib/supabase/server";

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

      if (providerToken && discordUserId) {
        const join = await addDiscordGuildMember({
          discordUserId,
          userAccessToken: providerToken,
        });
        if (!join.ok) {
          console.error(
            "Discord guild join failed",
            join.status,
            join.detail,
          );
        }
      } else {
        console.error(
          "Discord guild join skipped: missing provider_token or discord user id",
        );
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
