import { ArrowRight, Users } from "lucide-react";
import { FaXbox } from "react-icons/fa";
import { SiDiscord, SiPlaystation, SiSteam } from "react-icons/si";
import { LandingContainer } from "@/components/landing/LandingContainer";
import type { ReactNode } from "react";

type Step = {
  number: string;
  title: string;
  description: string;
  icons: ReactNode;
};

const steps: Step[] = [
  {
    number: "1",
    title: "Sign in with Discord",
    description: "Quick and secure. Unlock your social gaming experience.",
    icons: <SiDiscord className="h-7 w-7 text-accent-hover" />,
  },
  {
    number: "2",
    title: "Connect Xbox, PlayStation, and Steam",
    description: "Link once through Discord. We handle the rest.",
    icons: (
      <div className="flex items-center gap-2.5">
        <FaXbox className="h-6 w-6 text-[#107C10]" />
        <SiPlaystation className="h-6 w-6 text-[#00439C]" />
        <SiSteam className="h-6 w-6 text-foreground" />
      </div>
    ),
  },
  {
    number: "3",
    title: "See friends, join parties, and play faster",
    description: "Live status, instant invites, and seamless party jumps.",
    icons: <Users className="h-7 w-7 text-foreground" />,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 border-t border-white/10 py-14 md:py-16">
      <LandingContainer>
        <h2 className="font-display mb-6 text-2xl font-extrabold uppercase tracking-tight text-foreground md:mb-8 md:text-3xl">
          How It Works
        </h2>

        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-0">
          {steps.map((step, index) => (
            <div key={step.number} className="contents">
              <article className="flex flex-col rounded-2xl border border-border-subtle bg-surface p-6 md:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                    {step.number}
                  </span>
                  {step.icons}
                </div>
                <h3 className="font-display mb-2 text-lg font-extrabold leading-snug tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </article>

              {index < steps.length - 1 ? (
                <div className="hidden items-center justify-center px-3 md:flex">
                  <ArrowRight className="h-5 w-5 text-accent" aria-hidden />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}
