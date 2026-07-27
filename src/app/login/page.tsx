import Link from "next/link";
import { Mail } from "lucide-react";
import { DiscordAuthButton } from "@/components/auth/DiscordAuthButton";
import { signInWithEmail } from "@/app/auth/actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const metadata = {
  title: "Nexus.gg — Log in",
  description: "Log in to Nexus.gg with Discord or email.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#07060b] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.28),transparent_55%)]" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
            N
          </div>
          <span className="text-sm font-bold tracking-[0.08em] text-foreground">
            NEXUS.GG
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Log in
          </h1>
          <p className="mt-2 text-sm text-white/65">
            Discord unlocks the full experience. Email keeps limited access.
          </p>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error === "invalid"
                ? "Enter a valid email and password."
                : error === "auth"
                  ? "Could not complete sign-in. Try again."
                  : error}
            </p>
          ) : null}

          <DiscordAuthButton
            label="Continue with Discord"
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-accent px-6 text-sm font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.35)] transition-colors hover:bg-accent-hover"
          />

          <div className="my-6 flex items-center gap-3 text-xs text-white/40">
            <div className="h-px flex-1 bg-white/10" />
            or email
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form action={signInWithEmail} className="space-y-3">
            <input type="hidden" name="next" value="/play" />
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-white/70">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-foreground outline-none ring-accent placeholder:text-white/35 focus:border-accent/50 focus:ring-1"
                placeholder="you@email.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-white/70">
                Password
              </span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                minLength={6}
                className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-foreground outline-none ring-accent placeholder:text-white/35 focus:border-accent/50 focus:ring-1"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-transparent px-6 text-sm font-semibold text-foreground transition-colors hover:border-white/40 hover:bg-white/5"
            >
              <Mail className="h-4 w-4" />
              Log in with Email
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/55">
            No account?{" "}
            <Link
              href="/signup"
              className="font-medium text-accent-hover hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
