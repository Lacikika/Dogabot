# Discord Bot

This is a full-featured, modular and scalable Discord bot using Discord.js v14, fully based on slash commands (/).

## Features

- Moderation: /ban, /kick, /mute, /unmute, /warn, /timeout, /clear
- Leveling System: /rank, /leaderboard
- Welcome/Leave System: Custom welcome/goodbye messages (text + image card)
- Auto Roles & Reaction Roles
- Music Commands: /play, /pause, /skip, /queue, /volume, /stop
- Economy System: /balance, /daily, /work, /give, /eco
- Giveaways: /giveaway create, /giveaway end, /giveaway reroll
- Utilities: /ping, /serverinfo, /userinfo, /avatar, /poll, /remind, /embed

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file and fill in the required values:
    - `DISCORD_TOKEN`: Your bot's token
    - `CLIENT_ID`: Your bot's client ID
    - `MONGO_URI`: Your MongoDB connection string
    - `CLIENT_SECRET`: Your bot's client secret
    - `NEXTAUTH_SECRET`: A secret for NextAuth
4. Deploy slash commands: `npm run deploy`
5. Start the bot: `npm start`
6. Start the web dashboard: `npm run dev --prefix web`

## Web Dashboard

The web dashboard is available at `http://localhost:3000`. You can use it to manage server-specific settings.
