export type Platform =
  | "xbox"
  | "playstation"
  | "steam"
  | "epic"
  | "nintendo"
  | "discord";

export type PlayerStatus = "online" | "in-game" | "in-party" | "looking";

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  href: string;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export type CurrentUser = {
  username: string;
  avatarUrl: string;
  status: PlayerStatus;
  level: number;
  xp: number;
  xpMax: number;
};

export type StatItem = {
  id: string;
  label: string;
  value: number | string;
  tone: "green" | "purple" | "blue" | "orange";
  icon:
    | "activity"
    | "gamepad"
    | "users"
    | "headset"
    | "party"
    | "radio"
    | "mail"
    | "user-plus"
    | "mic"
    | "calendar";
  hint?: string;
};

export type FriendPresence =
  | "online"
  | "in-game"
  | "in-party"
  | "away"
  | "offline";

export type NexusFriend = {
  id: string;
  username: string;
  avatarUrl: string;
  status: FriendPresence;
  gameTitle: string | null;
  gameIconUrl: string | null;
  platforms: Platform[];
};

export type PlatformContact = {
  id: string;
  username: string;
  avatarUrl: string;
  sourcePlatform: Platform;
  status: FriendPresence;
  gameTitle: string | null;
  mutualFriends: { id: string; username: string; avatarUrl: string }[];
  mutualCount: number;
  /** True when the signed-in user already sent a pending request. */
  requestPending?: boolean;
};

export type SuggestedFriend = {
  id: string;
  username: string;
  avatarUrl: string;
  mutualCount: number;
  recentGames: string;
};

export type FriendRequest = {
  id: string;
  /** Profile id of the requester (for navigation later). */
  userId?: string;
  username: string;
  avatarUrl: string;
  mutualCount: number;
};

export type OnlineFriend = {
  id: string;
  username: string;
  avatarUrl: string;
  gameTitle: string | null;
  platform: Platform;
};

export type ImportedPlatform = {
  id: string;
  label: string;
  platform: Platform;
  connected: boolean;
};

export type PlayingSession = {
  id: string;
  username: string;
  avatarUrl: string;
  gameTitle: string;
  coverUrl: string;
  platform: Platform;
  status: "in-party" | "in-game" | "looking";
  partySize?: number;
  partyMax?: number;
  action: "join-party" | "join-game" | "invite";
};

export type RecentGame = {
  id: string;
  title: string;
  coverUrl: string;
  friendsPlaying: number;
  recentlyPlayed?: boolean;
};

export type LfgPlayer = {
  id: string;
  username: string;
  avatarUrl: string;
  rank: string;
  gameTitle: string;
  platform: Platform;
  lookingFor: number;
};

export type SmartMatchTag = {
  id: string;
  label: string;
};

export type SmartMatchSuggestion = {
  id: string;
  username: string;
  avatarUrl: string;
};

export type ActivityItem = {
  id: string;
  username: string;
  avatarUrl: string;
  message: string;
  timeAgo: string;
  type: "trophy" | "party" | "video" | "level" | "friend";
};

export type GameHub = {
  id: string;
  title: string;
  iconUrl: string;
  membersLabel: string;
};

export type UpcomingEvent = {
  id: string;
  title: string;
  gameTitle: string;
  type: string;
  dateLabel: string;
  imageUrl: string;
};

export type PartyTag = string;

export type YourParty = {
  id: string;
  name: string;
  gameTitle: string;
  coverUrl: string;
  description: string;
  tags: PartyTag[];
  platforms: Platform[];
  members: { id: string; username: string; avatarUrl: string }[];
  extraMembers: number;
  openSlots: number;
  partyMax: number;
  readyStatus: string;
};

export type OpenParty = {
  id: string;
  gameTitle: string;
  coverUrl: string;
  host: { username: string; avatarUrl: string };
  tags: PartyTag[];
  platforms: Platform[];
  partySize: number;
  partyMax: number;
};

export type LiveRoom = {
  id: string;
  title: string;
  gameTitle: string;
  coverUrl: string;
  host: { username: string; avatarUrl: string; verified?: boolean };
  listenersLabel: string;
  listeners: { id: string; username: string; avatarUrl: string }[];
  action: "listen" | "request-speak";
};

export type RoomTopic = {
  id: string;
  label: string;
  icon: "strategy" | "ranked" | "esports" | "chill" | "news" | "coaching";
  activeRooms: number;
};

export type UpcomingRoom = {
  id: string;
  title: string;
  gameTitle: string;
  coverUrl: string;
  host: { username: string; avatarUrl: string; verified?: boolean };
  whenLabel: string;
};

export type TrendingLiveRoom = {
  id: string;
  title: string;
  hostUsername: string;
  coverUrl: string;
  viewersLabel: string;
};

export type PopularHost = {
  id: string;
  username: string;
  avatarUrl: string;
  followersLabel: string;
};

export type LiveNowByGame = {
  id: string;
  gameTitle: string;
  iconUrl: string;
  roomsLabel: string;
  growthLabel: string;
};

export type PartyInvite = {
  id: string;
  username: string;
  avatarUrl: string;
  gameTitle: string;
};

export type FriendInParty = {
  id: string;
  username: string;
  avatarUrl: string;
  gameTitle: string;
};

export type LiveNowItem = {
  id: string;
  username: string;
  avatarUrl: string;
  roomTitle: string;
  viewers: number;
};

export const currentUser: CurrentUser = {
  username: "StormRider88",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
  status: "online",
  level: 42,
  xp: 12450,
  xpMax: 20000,
};

export const navGroups: NavGroup[] = [
  {
    id: "main",
    label: "MAIN",
    items: [
      { id: "play-now", label: "Play Now", icon: "zap", href: "/play" },
      { id: "friends", label: "Friends", icon: "users", href: "/friends" },
      { id: "parties", label: "Parties", icon: "party-popper", href: "/parties" },
      {
        id: "messages",
        label: "Messages",
        icon: "message-square",
        badge: 3,
        href: "#",
      },
    ],
  },
  {
    id: "explore",
    label: "EXPLORE",
    items: [
      { id: "rooms", label: "Rooms", icon: "radio", href: "/rooms" },
      { id: "game-hubs", label: "Game Hubs", icon: "layout-grid", href: "#" },
      { id: "events", label: "Events", icon: "calendar", href: "#" },
    ],
  },
  {
    id: "library",
    label: "LIBRARY",
    items: [{ id: "my-games", label: "My Games", icon: "gamepad-2", href: "#" }],
  },
  {
    id: "settings",
    label: "SETTINGS",
    items: [{ id: "settings", label: "Settings", icon: "settings", href: "#" }],
  },
];

export const stats: StatItem[] = [
  { id: "online", label: "Online", value: 24, tone: "green", icon: "activity" },
  { id: "in-game", label: "In Game", value: 7, tone: "purple", icon: "gamepad" },
  { id: "in-party", label: "In Party", value: 3, tone: "blue", icon: "users" },
  {
    id: "looking",
    label: "Looking to Play",
    value: 5,
    tone: "orange",
    icon: "headset",
  },
];

export const playingSessions: PlayingSession[] = [
  {
    id: "1",
    username: "ChiefNova",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    gameTitle: "Halo Infinite",
    coverUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    platform: "xbox",
    status: "in-party",
    partySize: 2,
    partyMax: 4,
    action: "join-party",
  },
  {
    id: "2",
    username: "DriftKing",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    gameTitle: "Gran Turismo 7",
    coverUrl:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
    platform: "playstation",
    status: "in-game",
    action: "join-game",
  },
  {
    id: "3",
    username: "BlockBuilder",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    gameTitle: "Minecraft",
    coverUrl:
      "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=600&h=400&fit=crop",
    platform: "xbox",
    status: "in-party",
    partySize: 3,
    partyMax: 8,
    action: "join-party",
  },
  {
    id: "4",
    username: "ShadowFox",
    avatarUrl: "https://i.pravatar.cc/150?img=68",
    gameTitle: "Call of Duty",
    coverUrl:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
    platform: "steam",
    status: "looking",
    action: "invite",
  },
  {
    id: "5",
    username: "PixelQueen",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    gameTitle: "Fortnite",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
    platform: "epic",
    status: "in-game",
    action: "join-game",
  },
];

export const recentGames: RecentGame[] = [
  {
    id: "cod",
    title: "Call of Duty",
    coverUrl:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=500&fit=crop",
    friendsPlaying: 4,
  },
  {
    id: "apex",
    title: "Apex Legends",
    coverUrl:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=500&fit=crop",
    friendsPlaying: 2,
  },
  {
    id: "rl",
    title: "Rocket League",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500&fit=crop",
    friendsPlaying: 1,
  },
  {
    id: "valorant",
    title: "Valorant",
    coverUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=500&fit=crop",
    friendsPlaying: 3,
  },
  {
    id: "elden",
    title: "Elden Ring",
    coverUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=500&fit=crop",
    friendsPlaying: 0,
    recentlyPlayed: true,
  },
];

export const lfgPlayers: LfgPlayer[] = [
  {
    id: "lfg1",
    username: "AceViper",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    rank: "Diamond I",
    gameTitle: "Valorant",
    platform: "steam",
    lookingFor: 1,
  },
  {
    id: "lfg2",
    username: "NeonBlade",
    avatarUrl: "https://i.pravatar.cc/150?img=26",
    rank: "Platinum II",
    gameTitle: "Apex Legends",
    platform: "xbox",
    lookingFor: 2,
  },
  {
    id: "lfg3",
    username: "QuietStorm",
    avatarUrl: "https://i.pravatar.cc/150?img=44",
    rank: "Gold III",
    gameTitle: "Call of Duty",
    platform: "playstation",
    lookingFor: 1,
  },
  {
    id: "lfg4",
    username: "RiftWalker",
    avatarUrl: "https://i.pravatar.cc/150?img=59",
    rank: "Immortal",
    gameTitle: "Valorant",
    platform: "steam",
    lookingFor: 1,
  },
];

export const smartMatchTags: SmartMatchTag[] = [
  { id: "style", label: "Similar Play Style" },
  { id: "evenings", label: "Usually Play Evenings" },
  { id: "fps", label: "FPS Preferred" },
];

export const smartMatchSuggestions: SmartMatchSuggestion[] = [
  {
    id: "sm1",
    username: "LunaPulse",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: "sm2",
    username: "OrbitKid",
    avatarUrl: "https://i.pravatar.cc/150?img=14",
  },
  {
    id: "sm3",
    username: "HexRunner",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
  },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "a1",
    username: "AlexUnlocked",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    message: "earned a trophy in Elden Ring",
    timeAgo: "2m",
    type: "trophy",
  },
  {
    id: "a2",
    username: "MiraQuest",
    avatarUrl: "https://i.pravatar.cc/150?img=16",
    message: "started a party in Halo Infinite",
    timeAgo: "8m",
    type: "party",
  },
  {
    id: "a3",
    username: "JonStream",
    avatarUrl: "https://i.pravatar.cc/150?img=22",
    message: "is live playing Apex Legends",
    timeAgo: "14m",
    type: "video",
  },
  {
    id: "a4",
    username: "KaraNova",
    avatarUrl: "https://i.pravatar.cc/150?img=28",
    message: "reached Level 50",
    timeAgo: "22m",
    type: "level",
  },
  {
    id: "a5",
    username: "TyForge",
    avatarUrl: "https://i.pravatar.cc/150?img=52",
    message: "added you as a friend",
    timeAgo: "1h",
    type: "friend",
  },
];

export const gameHubs: GameHub[] = [
  {
    id: "h1",
    title: "Call of Duty",
    iconUrl:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=100&h=100&fit=crop",
    membersLabel: "124K Members",
  },
  {
    id: "h2",
    title: "Minecraft",
    iconUrl:
      "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=100&h=100&fit=crop",
    membersLabel: "98K Members",
  },
  {
    id: "h3",
    title: "Fortnite",
    iconUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
    membersLabel: "86K Members",
  },
  {
    id: "h4",
    title: "Apex Legends",
    iconUrl:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop",
    membersLabel: "71K Members",
  },
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "e1",
    title: "Halo Championship",
    gameTitle: "Halo Infinite",
    type: "Tournament",
    dateLabel: "May 25 · 3:00 PM",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=120&fit=crop",
  },
  {
    id: "e2",
    title: "Weekend Raid Night",
    gameTitle: "Destiny 2",
    type: "Community",
    dateLabel: "May 26 · 7:00 PM",
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&h=120&fit=crop",
  },
  {
    id: "e3",
    title: "Rocket League Cup",
    gameTitle: "Rocket League",
    type: "Tournament",
    dateLabel: "May 28 · 5:30 PM",
    imageUrl:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=120&fit=crop",
  },
];

export const partyStats: StatItem[] = [
  {
    id: "active-parties",
    label: "Active Parties",
    value: 872,
    tone: "purple",
    icon: "party",
    hint: "In progress",
  },
  {
    id: "joinable-parties",
    label: "Joinable Parties",
    value: 248,
    tone: "green",
    icon: "users",
    hint: "Parties open",
  },
  {
    id: "friends-in-parties",
    label: "Friends in Parties",
    value: 14,
    tone: "blue",
    icon: "users",
    hint: "Playing now",
  },
  {
    id: "invites",
    label: "Invites",
    value: 23,
    tone: "orange",
    icon: "mail",
    hint: "Pending",
  },
];

export const roomStats: StatItem[] = [
  {
    id: "live-rooms",
    label: "Live Rooms",
    value: 186,
    tone: "purple",
    icon: "radio",
    hint: "Right now",
  },
  {
    id: "active-listeners",
    label: "Active Listeners",
    value: "12.4K",
    tone: "green",
    icon: "headset",
    hint: "Across all rooms",
  },
  {
    id: "active-hosts",
    label: "Active Hosts",
    value: 342,
    tone: "blue",
    icon: "mic",
    hint: "Speaking live",
  },
  {
    id: "upcoming-rooms",
    label: "Upcoming Rooms",
    value: 57,
    tone: "orange",
    icon: "calendar",
    hint: "Next 7 days",
  },
];

export const yourParty: YourParty = {
  id: "yp1",
  name: "Rocket League Squad",
  gameTitle: "Rocket League",
  coverUrl:
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=640&h=400&fit=crop",
  description: "Competitive ranked · Good vibes only 🚀",
  tags: ["Competitive", "Cross-Play", "Mic On"],
  platforms: ["steam", "playstation", "xbox"],
  members: [
    {
      id: "m1",
      username: "StormRider88",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: "m2",
      username: "NeoSpark",
      avatarUrl: "https://i.pravatar.cc/150?img=32",
    },
    {
      id: "m3",
      username: "VoltAce",
      avatarUrl: "https://i.pravatar.cc/150?img=45",
    },
  ],
  extraMembers: 2,
  openSlots: 1,
  partyMax: 4,
  readyStatus: "Everyone Ready",
};

export const openParties: OpenParty[] = [
  {
    id: "op1",
    gameTitle: "Apex Legends",
    coverUrl:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop",
    host: {
      username: "WraithMain",
      avatarUrl: "https://i.pravatar.cc/150?img=25",
    },
    tags: ["Cross-Play", "Ranked", "Mic On"],
    platforms: ["steam", "xbox"],
    partySize: 2,
    partyMax: 3,
  },
  {
    id: "op2",
    gameTitle: "Valorant",
    coverUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    host: {
      username: "JettDash",
      avatarUrl: "https://i.pravatar.cc/150?img=48",
    },
    tags: ["Competitive", "Mic On"],
    platforms: ["steam"],
    partySize: 3,
    partyMax: 5,
  },
  {
    id: "op3",
    gameTitle: "Fortnite",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
    host: {
      username: "BuildGod",
      avatarUrl: "https://i.pravatar.cc/150?img=60",
    },
    tags: ["Casual", "Cross-Play"],
    platforms: ["epic", "playstation", "xbox"],
    partySize: 2,
    partyMax: 4,
  },
  {
    id: "op4",
    gameTitle: "Call of Duty",
    coverUrl:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
    host: {
      username: "GhostOps",
      avatarUrl: "https://i.pravatar.cc/150?img=13",
    },
    tags: ["Cross-Play", "Mic On"],
    platforms: ["xbox", "playstation"],
    partySize: 2,
    partyMax: 2,
  },
];

export const liveRooms: LiveRoom[] = [
  {
    id: "lr1",
    title: "Elden Ring Boss Strategies",
    gameTitle: "Elden Ring",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop",
    host: {
      username: "MiraQuest",
      avatarUrl: "https://i.pravatar.cc/150?img=16",
      verified: true,
    },
    listenersLabel: "1.2K",
    listeners: [
      { id: "l1", username: "A", avatarUrl: "https://i.pravatar.cc/150?img=1" },
      { id: "l2", username: "B", avatarUrl: "https://i.pravatar.cc/150?img=2" },
      { id: "l3", username: "C", avatarUrl: "https://i.pravatar.cc/150?img=4" },
      { id: "l4", username: "D", avatarUrl: "https://i.pravatar.cc/150?img=6" },
    ],
    action: "listen",
  },
  {
    id: "lr2",
    title: "Apex Legends Ranked Mentality",
    gameTitle: "Apex Legends",
    coverUrl:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=500&fit=crop",
    host: {
      username: "DriftKing",
      avatarUrl: "https://i.pravatar.cc/150?img=15",
      verified: true,
    },
    listenersLabel: "864",
    listeners: [
      { id: "l5", username: "E", avatarUrl: "https://i.pravatar.cc/150?img=7" },
      { id: "l6", username: "F", avatarUrl: "https://i.pravatar.cc/150?img=8" },
      { id: "l7", username: "G", avatarUrl: "https://i.pravatar.cc/150?img=10" },
    ],
    action: "request-speak",
  },
  {
    id: "lr3",
    title: "Warzone Meta Discussion",
    gameTitle: "Call of Duty: Warzone",
    coverUrl:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=500&fit=crop",
    host: {
      username: "HexRunner",
      avatarUrl: "https://i.pravatar.cc/150?img=20",
      verified: true,
    },
    listenersLabel: "2.1K",
    listeners: [
      { id: "l8", username: "H", avatarUrl: "https://i.pravatar.cc/150?img=17" },
      { id: "l9", username: "I", avatarUrl: "https://i.pravatar.cc/150?img=19" },
      { id: "l10", username: "J", avatarUrl: "https://i.pravatar.cc/150?img=23" },
      { id: "l11", username: "K", avatarUrl: "https://i.pravatar.cc/150?img=24" },
    ],
    action: "listen",
  },
  {
    id: "lr4",
    title: "Valorant Agent Guide Live",
    gameTitle: "Valorant",
    coverUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop",
    host: {
      username: "SoftAim",
      avatarUrl: "https://i.pravatar.cc/150?img=29",
      verified: true,
    },
    listenersLabel: "532",
    listeners: [
      { id: "l12", username: "L", avatarUrl: "https://i.pravatar.cc/150?img=30" },
      { id: "l13", username: "M", avatarUrl: "https://i.pravatar.cc/150?img=31" },
      { id: "l14", username: "N", avatarUrl: "https://i.pravatar.cc/150?img=34" },
    ],
    action: "request-speak",
  },
];

export const roomTopics: RoomTopic[] = [
  { id: "rt1", label: "Strategy & Tactics", icon: "strategy", activeRooms: 42 },
  { id: "rt2", label: "Ranked Play", icon: "ranked", activeRooms: 38 },
  { id: "rt3", label: "Esports", icon: "esports", activeRooms: 21 },
  { id: "rt4", label: "Chill & Hangout", icon: "chill", activeRooms: 56 },
  { id: "rt5", label: "Game News", icon: "news", activeRooms: 17 },
  { id: "rt6", label: "Coaching & Tips", icon: "coaching", activeRooms: 29 },
];

export const upcomingRooms: UpcomingRoom[] = [
  {
    id: "ur1",
    title: "Season Reset Prep Talk",
    gameTitle: "Apex Legends",
    coverUrl:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop",
    host: {
      username: "MiraQuest",
      avatarUrl: "https://i.pravatar.cc/150?img=16",
      verified: true,
    },
    whenLabel: "Today · 3:00 PM",
  },
  {
    id: "ur2",
    title: "Patch Notes Deep Dive",
    gameTitle: "Valorant",
    coverUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    host: {
      username: "NightOwl",
      avatarUrl: "https://i.pravatar.cc/150?img=21",
      verified: true,
    },
    whenLabel: "Today · 7:30 PM",
  },
  {
    id: "ur3",
    title: "Raid Strategy Workshop",
    gameTitle: "Destiny 2",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
    host: {
      username: "Tactician",
      avatarUrl: "https://i.pravatar.cc/150?img=18",
      verified: true,
    },
    whenLabel: "Tomorrow · 5:00 PM",
  },
  {
    id: "ur4",
    title: "Pro Watch Party",
    gameTitle: "League of Legends",
    coverUrl:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop",
    host: {
      username: "JonStream",
      avatarUrl: "https://i.pravatar.cc/150?img=22",
      verified: true,
    },
    whenLabel: "Sat · 2:00 PM",
  },
];

export const trendingLiveRooms: TrendingLiveRoom[] = [
  {
    id: "tl1",
    title: "Warzone News & Updates",
    hostUsername: "HexRunner",
    coverUrl:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&h=200&fit=crop",
    viewersLabel: "2.1K",
  },
  {
    id: "tl2",
    title: "Elden Ring Boss Strategies",
    hostUsername: "MiraQuest",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop",
    viewersLabel: "1.2K",
  },
  {
    id: "tl3",
    title: "Apex Ranked Mentality",
    hostUsername: "DriftKing",
    coverUrl:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=200&fit=crop",
    viewersLabel: "864",
  },
  {
    id: "tl4",
    title: "Late Night Chill Lounge",
    hostUsername: "LoFiNova",
    coverUrl:
      "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop",
    viewersLabel: "640",
  },
];

export const popularHosts: PopularHost[] = [
  {
    id: "ph1",
    username: "MiraQuest",
    avatarUrl: "https://i.pravatar.cc/150?img=16",
    followersLabel: "48.2K",
  },
  {
    id: "ph2",
    username: "DriftKing",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    followersLabel: "36.8K",
  },
  {
    id: "ph3",
    username: "HexRunner",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    followersLabel: "29.1K",
  },
  {
    id: "ph4",
    username: "SoftAim",
    avatarUrl: "https://i.pravatar.cc/150?img=29",
    followersLabel: "22.4K",
  },
];

export const liveNowByGame: LiveNowByGame[] = [
  {
    id: "lg1",
    gameTitle: "Call of Duty: Warzone",
    iconUrl:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=100&h=100&fit=crop",
    roomsLabel: "2.3K",
    growthLabel: "+12%",
  },
  {
    id: "lg2",
    gameTitle: "Apex Legends",
    iconUrl:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop",
    roomsLabel: "1.8K",
    growthLabel: "+8%",
  },
  {
    id: "lg3",
    gameTitle: "Valorant",
    iconUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop",
    roomsLabel: "1.4K",
    growthLabel: "+15%",
  },
  {
    id: "lg4",
    gameTitle: "Elden Ring",
    iconUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
    roomsLabel: "920",
    growthLabel: "+6%",
  },
];

export const partyInvites: PartyInvite[] = [
  {
    id: "pi1",
    username: "AceViper",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    gameTitle: "Valorant",
  },
  {
    id: "pi2",
    username: "BlockBuilder",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    gameTitle: "Minecraft",
  },
  {
    id: "pi3",
    username: "DriftKing",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    gameTitle: "Gran Turismo 7",
  },
];

export const friendsInParties: FriendInParty[] = [
  {
    id: "fp1",
    username: "AceViper",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    gameTitle: "Call of Duty: MWIII",
  },
  {
    id: "fp2",
    username: "NeonBlade",
    avatarUrl: "https://i.pravatar.cc/150?img=26",
    gameTitle: "Apex Legends",
  },
  {
    id: "fp3",
    username: "QuietStorm",
    avatarUrl: "https://i.pravatar.cc/150?img=44",
    gameTitle: "Fortnite",
  },
];

export const liveNowItems: LiveNowItem[] = [
  {
    id: "ln1",
    username: "JonStream",
    avatarUrl: "https://i.pravatar.cc/150?img=22",
    roomTitle: "Ranked Grind Session",
    viewers: 856,
  },
  {
    id: "ln2",
    username: "MiraQuest",
    avatarUrl: "https://i.pravatar.cc/150?img=16",
    roomTitle: "Chill & Chat",
    viewers: 412,
  },
  {
    id: "ln3",
    username: "HexRunner",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    roomTitle: "Warzone Drop-In",
    viewers: 291,
  },
];

export const friendStats: StatItem[] = [
  {
    id: "nexus-friends",
    label: "Nexus Friends",
    value: 32,
    tone: "purple",
    icon: "users",
    hint: "Your inner circle",
  },
  {
    id: "platform-contacts",
    label: "Platform Contacts",
    value: 84,
    tone: "blue",
    icon: "users",
    hint: "From connected platforms",
  },
  {
    id: "online-now",
    label: "Online Now",
    value: 14,
    tone: "green",
    icon: "activity",
    hint: "Across all platforms",
  },
  {
    id: "pending-requests",
    label: "Pending Requests",
    value: 6,
    tone: "orange",
    icon: "user-plus",
    hint: "From friends & contacts",
  },
];

export const nexusFriends: NexusFriend[] = [
  {
    id: "nf1",
    username: "ChiefNova",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    status: "online",
    gameTitle: "Apex Legends",
    gameIconUrl: null,
    platforms: ["xbox", "steam"],
  },
  {
    id: "nf2",
    username: "DriftKing",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    status: "in-game",
    gameTitle: "Gran Turismo 7",
    gameIconUrl: null,
    platforms: ["playstation"],
  },
  {
    id: "nf3",
    username: "PixelQueen",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    status: "in-party",
    gameTitle: "Minecraft",
    gameIconUrl: null,
    platforms: ["xbox", "playstation"],
  },
  {
    id: "nf4",
    username: "ShadowFox",
    avatarUrl: "https://i.pravatar.cc/150?img=68",
    status: "away",
    gameTitle: null,
    gameIconUrl: null,
    platforms: ["steam", "discord"],
  },
  {
    id: "nf5",
    username: "NeonBlade",
    avatarUrl: "https://i.pravatar.cc/150?img=26",
    status: "in-game",
    gameTitle: "Call of Duty",
    gameIconUrl: null,
    platforms: ["xbox", "steam", "playstation"],
  },
];

export const platformContacts: PlatformContact[] = [
  {
    id: "pc1",
    username: "xXSniperXx",
    avatarUrl: "https://i.pravatar.cc/150?img=52",
    sourcePlatform: "discord",
    status: "online",
    gameTitle: "Valorant",
    mutualFriends: [
      { id: "m1", username: "A", avatarUrl: "https://i.pravatar.cc/150?img=11" },
      { id: "m2", username: "B", avatarUrl: "https://i.pravatar.cc/150?img=12" },
      { id: "m3", username: "C", avatarUrl: "https://i.pravatar.cc/150?img=13" },
    ],
    mutualCount: 4,
  },
  {
    id: "pc2",
    username: "RacingRyan",
    avatarUrl: "https://i.pravatar.cc/150?img=60",
    sourcePlatform: "xbox",
    status: "in-game",
    gameTitle: "Forza Horizon 5",
    mutualFriends: [
      { id: "m4", username: "D", avatarUrl: "https://i.pravatar.cc/150?img=14" },
      { id: "m5", username: "E", avatarUrl: "https://i.pravatar.cc/150?img=16" },
    ],
    mutualCount: 2,
  },
  {
    id: "pc3",
    username: "SteamSamurai",
    avatarUrl: "https://i.pravatar.cc/150?img=13",
    sourcePlatform: "steam",
    status: "online",
    gameTitle: "Counter-Strike 2",
    mutualFriends: [
      { id: "m6", username: "F", avatarUrl: "https://i.pravatar.cc/150?img=17" },
      { id: "m7", username: "G", avatarUrl: "https://i.pravatar.cc/150?img=18" },
      { id: "m8", username: "H", avatarUrl: "https://i.pravatar.cc/150?img=19" },
    ],
    mutualCount: 7,
  },
  {
    id: "pc4",
    username: "PSNProdigy",
    avatarUrl: "https://i.pravatar.cc/150?img=57",
    sourcePlatform: "playstation",
    status: "away",
    gameTitle: null,
    mutualFriends: [
      { id: "m9", username: "I", avatarUrl: "https://i.pravatar.cc/150?img=20" },
    ],
    mutualCount: 1,
  },
  {
    id: "pc5",
    username: "LobbyLegend",
    avatarUrl: "https://i.pravatar.cc/150?img=36",
    sourcePlatform: "discord",
    status: "in-game",
    gameTitle: "Fortnite",
    mutualFriends: [
      { id: "m10", username: "J", avatarUrl: "https://i.pravatar.cc/150?img=21" },
      { id: "m11", username: "K", avatarUrl: "https://i.pravatar.cc/150?img=22" },
    ],
    mutualCount: 3,
  },
];

export const suggestedFriends: SuggestedFriend[] = [
  {
    id: "sf1",
    username: "AceViper",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    mutualCount: 5,
    recentGames: "Apex · Warzone",
  },
  {
    id: "sf2",
    username: "QuietStorm",
    avatarUrl: "https://i.pravatar.cc/150?img=44",
    mutualCount: 3,
    recentGames: "Fortnite · Rocket League",
  },
  {
    id: "sf3",
    username: "HexRunner",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    mutualCount: 8,
    recentGames: "Valorant · CS2",
  },
  {
    id: "sf4",
    username: "MiraQuest",
    avatarUrl: "https://i.pravatar.cc/150?img=16",
    mutualCount: 2,
    recentGames: "Minecraft · Stardew",
  },
];

export const friendRequests: FriendRequest[] = [
  {
    id: "fr1",
    username: "GamerGirl42",
    avatarUrl: "https://i.pravatar.cc/150?img=45",
    mutualCount: 3,
  },
  {
    id: "fr2",
    username: "RustyNuts",
    avatarUrl: "https://i.pravatar.cc/150?img=59",
    mutualCount: 1,
  },
  {
    id: "fr3",
    username: "NightHawk",
    avatarUrl: "https://i.pravatar.cc/150?img=70",
    mutualCount: 6,
  },
];

export const onlineFriends: OnlineFriend[] = [
  {
    id: "of1",
    username: "ChiefNova",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    gameTitle: "Apex Legends",
    platform: "xbox",
  },
  {
    id: "of2",
    username: "DriftKing",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    gameTitle: "Gran Turismo 7",
    platform: "playstation",
  },
  {
    id: "of3",
    username: "PixelQueen",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    gameTitle: "Minecraft",
    platform: "xbox",
  },
  {
    id: "of4",
    username: "NeonBlade",
    avatarUrl: "https://i.pravatar.cc/150?img=26",
    gameTitle: "Call of Duty",
    platform: "steam",
  },
  {
    id: "of5",
    username: "AceViper",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    gameTitle: null,
    platform: "discord",
  },
];

export const importedPlatforms: ImportedPlatform[] = [
  { id: "ip1", label: "Discord", platform: "discord", connected: true },
  { id: "ip2", label: "Xbox Live", platform: "xbox", connected: true },
  { id: "ip3", label: "Steam", platform: "steam", connected: true },
  {
    id: "ip4",
    label: "PlayStation Network",
    platform: "playstation",
    connected: true,
  },
];
