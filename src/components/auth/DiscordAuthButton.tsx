"use client";

import { SiDiscord } from "react-icons/si";
import { createClient } from "@/lib/supabase/client";

type DiscordAuthButtonProps = {
  label?: string;
  className?: string;
  next?: string;
};

export function DiscordAuthButton({
  label = "Sign Up with Discord",
  className,
  next = "/play",
}: DiscordAuthButtonProps) {
  async function handleClick() {
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        // guilds.join lets us auto-add the user to the Nexus Discord server
        scopes: "identify email guilds.join",
        queryParams: {
          // Force re-consent when scopes change so existing users get guilds.join
          prompt: "consent",
        },
      },
    });

    if (error) {
      window.location.href = `/login?error=${encodeURIComponent(error.message)}`;
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      <SiDiscord className="h-5 w-5" />
      {label}
    </button>
  );
}
