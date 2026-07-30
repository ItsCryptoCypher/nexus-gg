import Image from "next/image";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#07060b]">
      {/* Hero band: background image + floating header + hero content */}
      <div className="relative min-h-svh overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          quality={100}
          className="object-cover object-right"
          sizes="100vw"
        />

        <LandingHeader />
        <HeroSection />
      </div>

      <HowItWorks />
    </div>
  );
}
