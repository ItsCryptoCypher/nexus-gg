import { Hexagon } from "lucide-react";
import { FaXbox } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { SiDiscord, SiEpicgames, SiPlaystation, SiSteam } from "react-icons/si";
import type { IconType } from "react-icons";
import type { Platform } from "@/data/mock";

type PlatformIconProps = {
  platform: Platform;
  className?: string;
};

const icons: Record<Platform, IconType> = {
  xbox: FaXbox,
  playstation: SiPlaystation,
  steam: SiSteam,
  epic: SiEpicgames,
  nintendo: BsNintendoSwitch,
  discord: SiDiscord,
  nexus: Hexagon,
};

const labels: Record<Platform, string> = {
  xbox: "Xbox",
  playstation: "PlayStation",
  steam: "Steam",
  epic: "Epic Games",
  nintendo: "Nintendo",
  discord: "Discord",
  nexus: "Nexus",
};

export function platformLabel(platform: Platform) {
  return labels[platform];
}

export function PlatformIcon({ platform, className = "h-4 w-4" }: PlatformIconProps) {
  const Icon = icons[platform];
  return <Icon className={className} aria-hidden />;
}
