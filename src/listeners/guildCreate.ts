import { Listener, ListenerOptions, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Guild } from 'discord.js';

import GuildModel from '#models/Guild';

@ApplyOptions<ListenerOptions>({ event: Events.GuildCreate })
export default class extends Listener {
    public async run(guild: Guild) {
        const guildModel = await GuildModel.findOne({ id: guild.id });
        if (!guildModel) {
            const newGuild = new GuildModel({
                id: guild.id,
            });
            await newGuild.save();
            return await guild.leave();
        }
        if (guildModel?.whitelist) return;

        await guild.leave();
        return;
    }
}