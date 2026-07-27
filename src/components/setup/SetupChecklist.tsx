import type { ReactNode } from "react";
import Link from "next/link";
import {
  Check,
  ExternalLink,
  Gamepad2,
  Radio,
  RefreshCw,
} from "lucide-react";
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

function StepRow({
  done,
  title,
  description,
  children,
}: {
  done: boolean;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex gap-3">
        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            done
              ? "bg-status-online text-black"
              : "border border-white/20 text-white/50"
          }`}
        >
          {done ? <Check className="h-4 w-4" strokeWidth={3} /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                done
                  ? "bg-status-online/15 text-status-online"
                  : "bg-white/5 text-white/45"
              }`}
            >
              {done ? "Done" : "Needed"}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/60">{description}</p>
          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function SetupChecklist({ state, next }: SetupChecklistProps) {
  const completedCount = [
    state.discordLinked,
    state.activityConfirmed,
    state.hasGamingPlatform,
  ].filter(Boolean).length;

  return (
    <div className="relative w-full max-w-lg">
      <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
          N
        </div>
        <span className="text-sm font-bold tracking-[0.08em] text-foreground">
          NEXUS.GG
        </span>
      </Link>

      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-accent-hover">
          QUICK SETUP
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Unlock live activity
        </h1>
        <p className="mt-2 text-sm text-white/65">
          One short checklist so friends can see when you&apos;re online and what
          you&apos;re playing. Takes about a minute.
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-white/50">
          <span>
            {completedCount} of 3 complete
            {state.displayName ? ` · ${state.displayName}` : ""}
          </span>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <StepRow
            done={state.discordLinked}
            title="Discord connected"
            description="You're signed in and added to the Nexus Discord server."
          >
            <div className="inline-flex items-center gap-2 text-sm text-white/70">
              <SiDiscord className="h-4 w-4 text-accent-hover" />
              Account linked
            </div>
          </StepRow>

          <StepRow
            done={state.activityConfirmed}
            title="Show your game activity"
            description={
              state.activityDetected
                ? "We detected a live Playing status from Discord — you're set."
                : "Discord won’t let apps flip this for you — do it once in Activity Privacy (takes ~15 seconds)."
            }
          >
            <ol className="mb-3 list-decimal space-y-1.5 pl-4 text-sm text-white/60">
              <li>
                Turn on <span className="text-white/85">Display current activity as a status message</span>
              </li>
              <li>
                Under your server list on that same page, turn <span className="text-white/85">Nexus</span> on
                (or use <span className="text-white/85">Toggle All On</span>)
              </li>
              <li>Launch a game once so Discord picks it up</li>
            </ol>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href="discord://-/settings/activity-privacy"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                <Radio className="h-4 w-4" />
                Open Activity Privacy
              </a>
              <a
                href="https://discord.com/settings/activity-privacy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
              >
                Open in browser
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              {!state.activityConfirmed ? (
                <form action={confirmActivityStatus}>
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 px-4 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
                  >
                    I turned it on
                  </button>
                </form>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-white/40">
              Both toggles live on one Discord settings page — you shouldn&apos;t
              need to dig through the server sidebar.
            </p>
          </StepRow>

          <StepRow
            done={state.hasGamingPlatform}
            title="Link a gaming account"
            description="Connect at least one platform in Discord. We pull what Discord already knows — no Xbox/PlayStation developer deals required."
          >
            <ul className="space-y-2">
              {SETUP_PLATFORMS.map((platform) => {
                const Icon = platformIcon[platform.type];
                const linked = state.linkedPlatforms.has(platform.type);
                return (
                  <li
                    key={platform.type}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0 text-white/70" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {platform.label}
                        </p>
                        <p className="truncate text-xs text-white/45">
                          {platform.blurb}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold ${
                        linked ? "text-status-online" : "text-white/35"
                      }`}
                    >
                      {linked ? "Linked" : "Not linked"}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href="discord://-/settings/connections"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                <Gamepad2 className="h-4 w-4" />
                Open Discord connections
              </a>
              <a
                href="https://discord.com/settings/connections"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
              >
                Open in browser
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <DiscordAuthButton
                label="Refresh links"
                next={`/setup?next=${encodeURIComponent(next)}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
              />
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs text-white/40">
              <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              After linking in Discord, click Refresh links so Nexus can see the
              new connections.
            </p>
          </StepRow>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <form action={finishSetup} className="sm:flex-1">
            <input type="hidden" name="next" value={next} />
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              {state.setupComplete ? "Continue to app" : "Save & continue"}
            </button>
          </form>
          <form action={dismissSetup} className="sm:flex-1">
            <input type="hidden" name="next" value={next} />
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-foreground"
            >
              Skip for now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
