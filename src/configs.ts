import type { ClientOptions } from 'discord.js';

export const CLIENT_OPTIONS: ClientOptions = {
    defaultPrefix: 'ali',
    regexPrefix: /^(hey\s+)?slave[,! ]/i,
    intents: ['GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES','GUILDS','GUILD_MESSAGE_TYPING'],
    partials: ['GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'USER']
}

export const TOKEN = process.env.TOKEN as string;