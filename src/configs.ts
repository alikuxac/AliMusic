import type { ClientOptions, Message } from 'discord.js';
import { Partials } from 'discord.js';
import UserModels from '#models/User';

export const TOKEN = process.env.TOKEN as string;
export const OWNERS: string[] = process.env['OWNERS']?.split(',') ?? [];
export const PREFIX = process.env.PREFIX as string;
export const MONGO = process.env.MONGO as string;

export const CLIENT_OPTIONS: ClientOptions = {
    defaultPrefix: PREFIX,
    regexPrefix: /^(hey\s+)?ali music[,! ]/i,
    intents: ['GuildMessages', 'GuildMembers', 'GuildVoiceStates', 'Guilds', 'GuildMessageTyping'],
    partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.User],
    fetchPrefix: async (message: Message) => {
        let prefix = [PREFIX];
        const user = await UserModels.findOne({ userID: message.author.id });
        if (user) prefix = prefix.concat(user.prefix);
        return prefix.map(p => p.toLowerCase());
    },
    caseInsensitivePrefixes: true
};