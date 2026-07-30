import Link from "next/link";
import { Mail } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { DiscordAuthButton } from "@/components/auth/DiscordAuthButton";
import { LandingContainer } from "@/components/landing/LandingContainer";

/**
 * Hero copy over the full-bleed background.
 * Background image lives on the parent wrapper with the floating header.
 */
export function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-[calc(100svh-5.5rem)] flex-col justify-center">
      <LandingContainer className="flex flex-1 flex-col justify-center py-12 lg:py-16">
        <div className="flex w-full max-w-lg flex-col justify-center">
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[1.05] tracking-tight text-foreground sm:text-6xl xl:text-[4.25rem]">
            Your Gaming
            <br />
            World
            <br />
            <span className="text-accent-hover">Connected.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
            See what your friends are playing, jump into games faster, and stay
            connected across platforms.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <DiscordAuthButton
              label="Sign Up with Discord"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-accent px-6 text-sm font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.45)] transition-colors hover:bg-accent-hover"
            />
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-white/25 bg-transparent px-6 text-sm font-semibold text-foreground transition-colors hover:border-white/40 hover:bg-white/5"
            >
              <Mail className="h-4 w-4" />
              Sign Up with Email
            </Link>
          </div>

          <div className="mt-7 flex max-w-sm flex-col gap-2.5">
            <div className="flex items-center gap-2.5 text-sm text-white/65">
              <SiDiscord className="h-4 w-4 shrink-0 text-accent-hover" />
              <span>Unlock the full experience with Discord.</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-white/65">
              <Mail className="h-4 w-4 shrink-0 text-accent-hover" />
              <span>Access hubs and communities with email.</span>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
