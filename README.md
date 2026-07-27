# Nexus.gg

Cross-platform social gaming app — see what friends are playing, join parties, and find people ready to play.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase Auth

## Getting started

1. Copy `.env.example` to `.env.local` and set your Supabase URL + publishable key.
2. In the [Supabase Dashboard](https://supabase.com/dashboard) → Authentication → Providers, enable **Discord** with your Discord Application Client ID/Secret.
3. Add redirect URLs under Authentication → URL Configuration:
   - `http://localhost:3000/auth/callback`
4. In the [Discord Developer Portal](https://discord.com/developers/applications) OAuth2 redirects, add:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/signup`, `/login` | Auth (Discord primary, email limited) |
| `/play`, `/parties` | App pages (will move to real data) |
| `/demo/play`, `/demo/parties` | **Mock showcase** with placeholder data — use for demos/investors |

## Discord presence bot

Keeps `player_presence` in sync from your Nexus Discord server.

Discord signup requests `guilds.join` and the auth callback auto-adds the user to `DISCORD_GUILD_ID`. The bot needs **Create Instant Invite** (plus **View Channels**) in that server.

1. Add to `.env.local`: `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID`, `SUPABASE_SERVICE_ROLE_KEY`
2. In a separate terminal: `npm run bot:presence`
3. Sign in with Discord (re-consent once if you signed up before `guilds.join`)
4. Refresh `/play` — Who's Playing uses live presence when you're online/in-game

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
- `npm run bot:presence` — Discord presence worker
