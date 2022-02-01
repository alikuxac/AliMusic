import { Command, CommandOptions, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: "reload",
    description: "Reloads a command",
    requiredClientPermissions: ['SEND_MESSAGES'],
    preconditions: ["OwnerOnly"],
})
export class ReloadCMD extends Command {
    public async messageRun(message: Message, args: Args) {
        const commandName = await args.rest('string').catch(() => null);
        if (!commandName) return message.reply({ content: 'Missing command name', allowedMentions: { repliedUser: false } });
        const command = this.container.stores.get('commands').get(commandName);
        
        if (!command) return message.reply({ content: 'Command not found', allowedMentions: { repliedUser: false } });
        await command.reload();
        return message.reply({ content: `Command ${commandName} has been reloaded`, allowedMentions: { repliedUser: false } });
    }
}