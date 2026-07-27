import Link from "next/link";
import { Check } from "lucide-react";
import { FaXbox } from "react-icons/fa";
import { SiDiscord, SiPlaystation, SiSteam } from "react-icons/si";
import { DiscordAuthButton } from "@/components/auth/DiscordAuthButton";
import {
  confirmActivityStatus,
  dismissSetup,
  finishSetup,
} from "@/app/setup/actions";
import { SETUP_PLATFORMS } from "@/lib/discord/connections";
import type { SetupState } from "@/lib/setup/get-setup-state";

type SetupChecklistProps = {
  state: SetupState;
  next: string;
};

const platformIcon = {
  steam: SiSteam,
  xbox: FaXbox,
  playstation: SiPlaystation,
} as const;

function StatusDot({ done, step }: { done: boolean; step: number }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        done
          ? "bg-status-online text-black"
          : "bg-accent text-white shadow-[0_0_20px_rgba(124,58,237,0.35)]"
      }`}
    >
      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : step}
    </div>
  );
}

export function SetupChecklist({ state, next }: SetupChecklistProps) {
  const remaining =
    Number(!state.activityConfirmed) + Number(!state.hasGamingPlatform);
  const focusActivity = !state.activityConfirmed;
  const focusPlatforms = state.activityConfirmed && !state.hasGamingPlatform;

  return (
    <div className="relative w-full max-w-md">
      <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
          N
        </div>
        <span className="text-sm font-bold tracking-[0.08em] text-foreground">
          NEXUS.GG
        </span>
      </Link>

      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-7">
        <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
          {state.setupComplete
            ? "You're all set"
            : remaining === 1
              ? "One quick step left"
              : "2 quick Discord steps"}
        </h1>
        <p className="mt-2 text-center text-sm text-white/60">
          {state.setupComplete
            ? "Friends can see when you're online and what you're playing."
            : "Takes under a minute. Tap a button, flip a switch, come back."}
        </p>

        {state.discordLinked ? (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-status-online/10 px-3 py-1.5 text-xs font-medium text-status-online">
            <SiDiscord className="h-3.5 w-3.5" />
            Discord connected
            {state.displayName ? ` · ${state.displayName}` : ""}
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {/* Step 1 — Activity */}
          <section
            className={`rounded-2xl border p-4 transition-colors sm:p-5 ${
              focusActivity
                ? "border-accent/50 bg-accent/10"
                : state.activityConfirmed
                  ? "border-white/10 bg-white/[0.02] opacity-70"
                  : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex gap-3">
              <StatusDot done={state.activityConfirmed} step={1} />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-foreground">
                  {state.activityConfirmed
                    ? "Game activity is on"
                    : "Let friends see your games"}
                </h2>

                {state.activityConfirmed ? (
                  <p className="mt-1 text-sm text-white/55">
                    {state.activityDetected
                      ? "Discord is sharing what you play."
                      : "Saved. You're good on this step."}
                  </p>
                ) : (
                  <>
                    <p className="mt-1 text-sm text-white/65">
                      Open Discord, turn on activity, then turn on{" "}
                      <span className="font-medium text-white">Nexus</span> in
                      the list.
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href="discord://-/settings/activity-privacy"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                      >
                        1. Open Discord settings
                      </a>
                      <a
                        href="https://discord.com/settings/activity-privacy"
                        target="_blank"
                        rel="noreferrer"
                        className="text-center text-xs text-white/40 underline-offset-2 hover:text-white/60 hover:underline"
                      >
                        Settings didn&apos;t open? Use browser instead
                      </a>
                      <form action={confirmActivityStatus}>
                        <button
                          type="submit"
                          className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
                        >
                          2. I turned it on — continue
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Step 2 — Platforms */}
          <section
            className={`rounded-2xl border p-4 transition-colors sm:p-5 ${
              focusPlatforms
                ? "border-accent/50 bg-accent/10"
                : state.hasGamingPlatform
                  ? "border-white/10 bg-white/[0.02] opacity-70"
                  : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex gap-3">
              <StatusDot done={state.hasGamingPlatform} step={2} />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-foreground">
                  {state.hasGamingPlatform
                    ? "Gaming account linked"
                    : "Link a gaming account"}
                </h2>

                {state.hasGamingPlatform ? (
                  <p className="mt-1 text-sm text-white/55">
                    Nice — Discord can share that platform&apos;s activity.
                  </p>
                ) : (
                  <>
                    <p className="mt-1 text-sm text-white/65">
                      Connect Steam, Xbox, or PlayStation inside Discord. Just
                      one is enough.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {SETUP_PLATFORMS.map((platform) => {
                        const Icon = platformIcon[platform.type];
                        const linked = state.linkedPlatforms.has(platform.type);
                        return (
                          <span
                            key={platform.type}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              linked
                                ? "bg-status-online/15 text-status-online"
                                : "bg-white/5 text-white/45"
                            }`}
                          >
                            <Icon className="h-3 w-3" />
                            {platform.label}
                            {linked ? " ✓" : ""}
                          </span>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href="discord://-/settings/connections"
                        className={`inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors ${
                          focusPlatforms
                            ? "bg-accent text-white hover:bg-accent-hover"
                            : "border border-white/20 bg-white/5 text-foreground hover:bg-white/10"
                        }`}
                      >
                        1. Open Discord connections
                      </a>
                      <a
                        href="https://discord.com/settings/connections"
                        target="_blank"
                        rel="noreferrer"
                        className="text-center text-xs text-white/40 underline-offset-2 hover:text-white/60 hover:underline"
                      >
                        Settings didn&apos;t open? Use browser instead
                      </a>
                      <DiscordAuthButton
                        label="2. I've linked one — refresh"
                        next={`/setup?next=${encodeURIComponent(next)}`}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>

        <form action={finishSetup} className="mt-6">
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-white/90"
          >
            {state.setupComplete ? "Go to Nexus" : "Continue to Nexus anyway"}
          </button>
        </form>

        {!state.setupComplete ? (
          <form action={dismissSetup} className="mt-3">
            <input type="hidden" name="next" value={next} />
            <button
              type="submit"
              className="w-full text-center text-sm text-white/40 transition-colors hover:text-white/65"
            >
              Skip for now
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
