import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function LandingAuthButtons() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims?.sub);

  if (isSignedIn) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/play"
          className="inline-flex h-9 items-center rounded-lg border border-white/20 px-3.5 text-sm font-medium text-foreground transition-colors hover:border-white/40 hover:bg-white/5 sm:px-4"
        >
          Open app
        </Link>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-lg bg-accent px-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:px-4"
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href="/login"
        className="inline-flex h-9 items-center rounded-lg border border-white/20 px-3.5 text-sm font-medium text-foreground transition-colors hover:border-white/40 hover:bg-white/5 sm:px-4"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="inline-flex h-9 items-center rounded-lg bg-accent px-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:px-4"
      >
        Sign Up
      </Link>
    </div>
  );
}
