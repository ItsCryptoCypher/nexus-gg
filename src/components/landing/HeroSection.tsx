import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { DiscordAuthButton } from "@/components/auth/DiscordAuthButton";

/**
 * Reference-matched hero: 40/60, 3-line headline, tilted UI glow.
 * Background image lives on the parent wrapper with the floating header.
 */
export function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-[calc(100svh-5.5rem)] flex-col justify-center">
      <div className="relative mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-8 px-4 py-12 md:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-2 lg:py-0 xl:gap-3 xl:px-8">
        {/* Left copy */}
        <div className="flex w-full max-w-lg flex-col justify-center">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl xl:text-[4.25rem]">
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

        {/* Right — tilted product shot with top-lit border */}
        <div className="relative flex min-w-0 items-center justify-center lg:justify-end">
          <div
            className="relative w-full origin-center"
            style={{
              transform: "perspective(1400px) rotateY(-12deg) rotateX(4deg)",
            }}
          >
            {/* Soft outer bloom */}
            <div className="pointer-events-none absolute -inset-4 rounded-[1.75rem] bg-accent/40 blur-2xl" />
            <div className="pointer-events-none absolute -top-3 left-[10%] right-[10%] h-8 rounded-full bg-violet-200/40 blur-xl" />

            {/* Gradient border: bright top → muted bottom */}
            <div
              className="relative rounded-2xl p-[1.5px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(196,181,253,0.9) 12%, rgba(124,58,237,0.65) 45%, rgba(76,29,149,0.25) 100%)",
                boxShadow:
                  "0 -2px 20px rgba(221,214,254,0.35), 0 20px 60px rgba(124,58,237,0.45)",
              }}
            >
              <div className="overflow-hidden rounded-[15px] bg-[#0b0b0d]">
                <Image
                  src="/nexus-dashboard.png"
                  alt="Nexus.gg Play Now dashboard"
                  width={1600}
                  height={1000}
                  priority
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
