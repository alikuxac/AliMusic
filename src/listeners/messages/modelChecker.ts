import { Listener, ListenerOptions, Events } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

import UserModels from "#models/User";

@ApplyOptions<ListenerOptions>({ event: Events.MessageCreate })
export default class extends Listener {
    async run(message: Message) {
        if (message.author.bot) return;

        const userModel = await UserModels.findOne({ userID: message.author.id });
        if (!userModel) {
            const newUser = new UserModels({
                userID: message.author.id,
            });
            await newUser.save();
        }
    }
}