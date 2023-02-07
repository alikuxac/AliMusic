import { Listener, ListenerOptions, Events } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import UserModels from '#models/User';

@ApplyOptions<ListenerOptions>({ event: Events.ClientReady, once: true })
export default class extends Listener {
    public async run() {
        const { client } = this.container;
        let UserCount = 0, GuildCount = 0, NewUserCount = 0;
        for (let [_id, guild] of client.guilds.cache) {
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