import { Listener, ListenerOptions, Events } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import GuildModels from '#models/Guild';
import UserModels from '#models/User';

@ApplyOptions<ListenerOptions>({ event: Events.ClientReady, once: true })
export default class extends Listener {
    public async run() {
        const { client } = this.container;
        let UserCount = 0, GuildCount = 0, NewUserCount = 0;
        for (let [id, guild] of client.guilds.cache) {
            GuildCount++;
            const guildModel = await GuildModels.findOne({ guildID: id });
            if (!guildModel) {
                const newGuild = new GuildModels({
                    guildID: id,
                });
                await newGuild.save();
            }
            const guildMembers = await guild.members.fetch();
            for (let [userID, member] of guildMembers.filter(member => !member.user.bot)) {
                if (member.user.bot) continue;
                UserCount++;
                const userModel = await UserModels.findOne({ userID });
                if (!userModel) {
                    NewUserCount++;
                    const newUser = new UserModels({
                        userID,
                    });
                    await newUser.save();
                }
            }
        }
        console.log(`Loaded total ${UserCount} users, ${NewUserCount} new users, ${GuildCount} guilds`);
    }
}