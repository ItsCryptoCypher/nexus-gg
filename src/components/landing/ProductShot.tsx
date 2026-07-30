import Image from "next/image";
import { LandingContainer } from "@/components/landing/LandingContainer";

/** Tilted product mockup shown below the hero. */
export function ProductShot() {
  return (
    <section className="relative z-10 py-12 md:py-16">
      <LandingContainer>
        <div className="relative mx-auto w-full max-w-5xl">
          <div
            className="relative w-full origin-center"
            style={{
              transform: "perspective(1400px) rotateY(-12deg) rotateX(4deg)",
            }}
          >
            <div className="pointer-events-none absolute -inset-4 rounded-[1.75rem] bg-accent/40 blur-2xl" />
            <div className="pointer-events-none absolute -top-3 left-[10%] right-[10%] h-8 rounded-full bg-violet-200/40 blur-xl" />

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
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
