import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { exec } from 'child_process';

@ApplyOptions<CommandOptions>({
    name: 'check-update',
    aliases: ['update'],
    preconditions: ['OwnerOnly']
})
export class CheckUpdateCMD extends Command {
    public messageRun(message: Message) {
        exec('git pull origin master', (error, stdout) => {
            const response = (error || stdout);
            if (!error) {
                if ((response as string).includes('Already up to date.')) {
                    message.reply('Bot already up to date. No changes since last pull');
                }
                else {
                    message.reply('Pulled from GitHub. Restarting bot. \n\nLogs: \n```' + response + '```');
                    setTimeout(() => {
                        process.exit();
                    }, 1000);
                }
            }
        });
    }
}