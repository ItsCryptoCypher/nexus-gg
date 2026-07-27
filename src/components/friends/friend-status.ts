import type { FriendPresence } from "@/data/mock";

export const friendStatusLabel: Record<FriendPresence, string> = {
  online: "Online",
  "in-game": "In Game",
  "in-party": "In Party",
  away: "Away",
  offline: "Offline",
};

export const friendStatusTone: Record<
  FriendPresence,
  "green" | "blue" | "orange" | "purple" | "gray"
> = {
  online: "green",
  "in-game": "blue",
  "in-party": "green",
  away: "orange",
  offline: "gray",
};

export const friendStatusTextClass: Record<FriendPresence, string> = {
  online: "text-status-online",
  "in-game": "text-status-in-game",
  "in-party": "text-status-online",
  away: "text-status-looking",
  offline: "text-muted",
};

export function avatarStatusFromPresence(
  status: FriendPresence,
): "online" | "offline" | "busy" {
  if (status === "offline") return "offline";
  if (status === "away") return "busy";
  return "online";
}
