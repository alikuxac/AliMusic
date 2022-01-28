import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
    description: 'ping pong'
})
export class PingCommand extends Command {
    public async messageRun(message: Message) {
        const msg = await message.reply('Ping?');

        const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
            }ms.`;

        return await msg.edit(content);
    }
}