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
  value: number;
  tone: "green" | "purple" | "blue" | "orange";
  icon: "activity" | "gamepad" | "users" | "headset" | "party" | "radio" | "mail";
  hint?: string;
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
  host: { username: string; avatarUrl: string };
  listenersLabel: string;
  listeners: { id: string; username: string; avatarUrl: string }[];
  action: "listen" | "request-speak";
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
      { id: "friends", label: "Friends", icon: "users", href: "#" },
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
      { id: "game-hubs", label: "Game Hubs", icon: "layout-grid", href: "#" },
      { id: "communities", label: "Communities", icon: "globe", href: "#" },
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
    id: "live-rooms",
    label: "Live Rooms",
    value: 186,
    tone: "blue",
    icon: "radio",
    hint: "Live now",
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
    title: "Chill & Chat",
    host: {
      username: "LoFiNova",
      avatarUrl: "https://i.pravatar.cc/150?img=9",
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
    title: "Warzone Strategy Lounge",
    host: {
      username: "Tactician",
      avatarUrl: "https://i.pravatar.cc/150?img=18",
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
    title: "Late Night Ranked Talk",
    host: {
      username: "NightOwl",
      avatarUrl: "https://i.pravatar.cc/150?img=21",
    },
    listenersLabel: "532",
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
    title: "Cozy Duo Finder",
    host: {
      username: "SoftAim",
      avatarUrl: "https://i.pravatar.cc/150?img=29",
    },
    listenersLabel: "318",
    listeners: [
      { id: "l12", username: "L", avatarUrl: "https://i.pravatar.cc/150?img=30" },
      { id: "l13", username: "M", avatarUrl: "https://i.pravatar.cc/150?img=31" },
      { id: "l14", username: "N", avatarUrl: "https://i.pravatar.cc/150?img=34" },
    ],
    action: "request-speak",
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
