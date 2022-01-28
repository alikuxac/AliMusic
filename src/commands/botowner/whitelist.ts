import { Command, CommandOptions, type Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { SnowflakeRegex } from '@sapphire/discord-utilities';
import type { Message } from "discord.js";
import Guild from "#models/Guild";

@ApplyOptions<CommandOptions>({
    name: "whitelist",
    aliases: ["wl"],
    description: "Whitelist a serverr",
    preconditions: ['OwnerOnly'],
    runIn: ["GUILD_TEXT", "GUILD_PUBLIC_THREAD"]
})
export default class WhitelistCMD extends Command {
    public async messageRun(message: Message, args: Args) {
        const guildID = await args.rest('string').catch(() => null);
        if (!guildID) return message.reply({ content: 'Missing guildID', allowedMentions: { repliedUser: false } });
        if (!SnowflakeRegex.test(guildID)) return message.reply({ content: 'Invalid value', allowedMentions: { repliedUser: false } });
        const guild = await Guild.findOne({ id: guildID });
        if (!guild) {
            const newGuild = new Guild({ id: guildID, whitelisted: true });
            await newGuild.save();
            return message.reply("This server has been whitelisted.");
        }
        if (guild.whitelist) {
            guild.whitelist = false;
            await guild.save();
            return message.reply("This server has been unwhitelisted.");
        }
        guild.whitelist = true;
        await guild.save();
        return message.reply("This server has been whitelisted.");
    }
}