import Link from "next/link";
import { LandingAuthButtons } from "@/components/landing/LandingAuthButtons";
import { LandingContainer } from "@/components/landing/LandingContainer";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Communities", href: "#communities" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export async function LandingHeader() {
  return (
    <header className="relative z-20 pt-4 md:pt-5">
      <LandingContainer>
        <div className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 px-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-4 md:h-16 md:px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
              N
            </div>
            <span className="font-display text-sm font-extrabold tracking-[0.08em] text-foreground">
              NEXUS.GG
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-white/75 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <LandingAuthButtons />
        </div>
      </LandingContainer>
    </header>
  );
}
