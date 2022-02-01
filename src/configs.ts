import type { ClientOptions, Message } from 'discord.js';

import UserModels from '#models/User';

export const TOKEN = process.env.TOKEN;
export const OWNERS: string[] = process.env['OWNERS']?.split(',') ?? [];
export const PREFIX = process.env.PREFIX;
export const MONGO = process.env.MONGO;

export const CLIENT_OPTIONS: ClientOptions = {
    defaultPrefix: PREFIX,
    regexPrefix: /^(hey\s+)?ali music[,! ]/i,
    intents: ['GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES', 'GUILDS', 'GUILD_MESSAGE_TYPING'],
    partials: ['GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'USER'],
    fetchPrefix: async (message: Message) => {
        if (!message.guild) return [PREFIX];
        const guild = await GuildModels.findOne({ id: message.guild.id });
        return [guild ? guild?.prefix : PREFIX];
    }
};