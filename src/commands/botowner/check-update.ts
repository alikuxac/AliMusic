import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, MessageCommandContext, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { exec } from 'child_process';

@ApplyOptions<CommandOptions>({
    name: 'check-update',
    aliases: ['update'],
    preconditions: ['OwnerOnly']
})
export class CheckUpdateCMD extends Command {
    public async messageRun(message: Message, _args: Args, context: MessageCommandContext) {
        exec('git pull origin master', async (error, stdout) => {
            const response = (error || stdout);
            if (!error) {
                if ((response as string).includes('Already up to date.')) {
                    await message.reply('Bot already up to date. No changes since last pull');
                }
                else {
                    await message.reply('Pulled from GitHub. Restarting bot. \n\nLogs: \n```' + response + '```');
                    return message.channel.send(`Run \`${context.prefix}eval (npx) pm2 stop AliMusic\` if you are using pm2 or \`${context.prefix}eval process.exit(1)\`.`)
                }
            }
        });
    }
}