import Image from "next/image";
import {
  Activity,
  Gamepad2,
  Headphones,
  MessageSquare,
  PartyPopper,
  Plus,
  Search,
  Users,
  Zap,
} from "lucide-react";
import { SiDiscord, SiPlaystation, SiSteam } from "react-icons/si";
import { FaXbox } from "react-icons/fa";

const sessions = [
  {
    name: "ChiefNova",
    game: "Halo Infinite",
    status: "In Party",
    statusTone: "text-status-online bg-status-online/15",
    action: "Join Party",
    cover:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=240&fit=crop",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    name: "DriftKing",
    game: "Gran Turismo 7",
    status: "In Game",
    statusTone: "text-status-in-game bg-status-in-game/15",
    action: "Join Game",
    cover:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=240&fit=crop",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    name: "BlockBuilder",
    game: "Minecraft",
    status: "In Party",
    statusTone: "text-status-online bg-status-online/15",
    action: "Join Party",
    cover:
      "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=400&h=240&fit=crop",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
];

const games = [
  {
    title: "Call of Duty",
    meta: "4 friends",
    cover:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&h=260&fit=crop",
  },
  {
    title: "Apex Legends",
    meta: "2 friends",
    cover:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=260&fit=crop",
  },
  {
    title: "Rocket League",
    meta: "1 friend",
    cover:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=260&fit=crop",
  },
  {
    title: "Valorant",
    meta: "3 friends",
    cover:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=260&fit=crop",
  },
  {
    title: "Elden Ring",
    meta: "Recent",
    cover:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&h=260&fit=crop",
  },
];

const lfg = [
  { name: "AceViper", rank: "Diamond I", lf: "LF 1", img: 11 },
  { name: "NeonBlade", rank: "Platinum II", lf: "LF 2", img: 26 },
  { name: "QuietStorm", rank: "Gold III", lf: "LF 1", img: 44 },
];

export function DashboardPreview() {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-4 rounded-2xl bg-accent/25 blur-2xl" />
      {/* Flat 16:9 laptop frame — no 3D tilt (tilt was making this look square) */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-accent/40 bg-background shadow-[0_0_40px_rgba(124,58,237,0.35)]">
        <div className="flex h-full">
          <aside className="hidden w-[28%] max-w-[150px] shrink-0 flex-col border-r border-border-subtle bg-background p-2 sm:flex">
            <div className="mb-2 flex items-center gap-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded bg-accent text-[8px] font-bold">
                N
              </div>
              <span className="text-[8px] font-bold tracking-wider">NEXUS.GG</span>
            </div>
            <p className="mb-1 px-1 text-[7px] font-semibold tracking-widest text-muted-dark">
              MAIN
            </p>
            <div className="mb-2 space-y-0.5">
              <div className="flex items-center gap-1 rounded-md bg-accent-soft px-1 py-1 text-[9px]">
                <Zap className="h-2.5 w-2.5 text-accent" />
                Play Now
              </div>
              {[
                { icon: Users, label: "Friends" },
                { icon: PartyPopper, label: "Parties" },
                { icon: MessageSquare, label: "Messages" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1 px-1 py-1 text-[9px] text-muted"
                >
                  <Icon className="h-2.5 w-2.5" />
                  {label}
                </div>
              ))}
            </div>
            <div className="mt-auto space-y-1.5">
              <div className="rounded-md border border-border-subtle bg-surface p-1.5">
                <div className="mb-1 flex items-center gap-1">
                  <Image
                    src="https://i.pravatar.cc/150?img=12"
                    alt=""
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-[8px] font-semibold">StormRider88</p>
                    <p className="text-[7px] text-status-online">Online</p>
                  </div>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[62%] bg-accent" />
                </div>
              </div>
              <div className="rounded-md border border-border-subtle bg-surface p-1.5">
                <p className="mb-1 text-[7px] text-muted">Connect Platforms</p>
                <div className="flex gap-1">
                  <FaXbox className="h-2.5 w-2.5 text-muted" />
                  <SiPlaystation className="h-2.5 w-2.5 text-muted" />
                  <SiSteam className="h-2.5 w-2.5 text-muted" />
                  <SiDiscord className="h-2.5 w-2.5 text-muted" />
                  <Plus className="h-2.5 w-2.5 text-muted" />
                </div>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden p-2.5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold">Play Now</p>
                <p className="text-[8px] text-muted">Jump in with friends</p>
              </div>
              <div className="hidden h-6 items-center gap-1 rounded-md border border-border-subtle bg-surface px-2 text-[8px] text-muted sm:flex">
                <Search className="h-2.5 w-2.5" />
                Search...
              </div>
            </div>

            <div className="mb-2 grid grid-cols-4 gap-1">
              {[
                { n: 24, l: "Online", Icon: Activity, c: "text-status-online" },
                { n: 7, l: "In Game", Icon: Gamepad2, c: "text-accent-hover" },
                { n: 3, l: "Party", Icon: Users, c: "text-status-in-game" },
                { n: 5, l: "LFG", Icon: Headphones, c: "text-status-looking" },
              ].map(({ n, l, Icon, c }) => (
                <div
                  key={l}
                  className="flex items-center gap-1 rounded-md border border-border-subtle bg-surface px-1.5 py-1"
                >
                  <Icon className={`h-2.5 w-2.5 ${c}`} />
                  <div>
                    <p className="text-[9px] font-bold leading-none">{n}</p>
                    <p className="text-[7px] text-muted">{l}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-2 overflow-hidden rounded-lg border border-border-subtle bg-surface p-1.5">
              <p className="mb-1 text-[9px] font-semibold">Who&apos;s Playing</p>
              <div className="flex gap-1.5 overflow-hidden">
                {sessions.map((s) => (
                  <div
                    key={s.name}
                    className="w-[88px] shrink-0 overflow-hidden rounded-md border border-border-subtle bg-surface-elevated"
                  >
                    <div className="relative h-10">
                      <Image
                        src={s.cover}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="88px"
                      />
                    </div>
                    <div className="space-y-0.5 p-1">
                      <p className="truncate text-[8px] font-semibold">{s.name}</p>
                      <p className="truncate text-[7px] text-muted">{s.game}</p>
                      <div className="rounded bg-accent py-0.5 text-center text-[7px] text-white">
                        {s.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex min-h-0 flex-1 gap-1.5 overflow-hidden">
              <div className="min-w-0 flex-1 rounded-lg border border-border-subtle bg-surface p-1.5">
                <p className="text-[9px] font-semibold">Jump Back In</p>
                <p className="mb-1 text-[7px] text-muted">Games you play often</p>
                <div className="grid grid-cols-5 gap-1">
                  {games.map((g) => (
                    <div key={g.title} className="min-w-0">
                      <div className="relative mb-0.5 aspect-[3/4] overflow-hidden rounded">
                        <Image
                          src={g.cover}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <p className="truncate text-[6px] text-muted">{g.meta}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden w-[120px] shrink-0 rounded-lg border border-border-subtle bg-surface p-1.5 md:block">
                <p className="mb-1 text-[9px] font-semibold">Looking for Players</p>
                <div className="mb-1 space-y-1">
                  {lfg.map((p) => (
                    <div key={p.name} className="flex items-center gap-1">
                      <Image
                        src={`https://i.pravatar.cc/150?img=${p.img}`}
                        alt=""
                        width={14}
                        height={14}
                        className="rounded-full"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[8px] font-medium">{p.name}</p>
                        <p className="truncate text-[6px] text-muted">{p.rank}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded bg-accent py-0.5 text-center text-[7px] text-white">
                  Find More
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
