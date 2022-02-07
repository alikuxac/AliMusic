import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import {
    RequiredUserInVoice,
    RequireSameVoiceChannel,
    RequiredBotInVoice,
    PlayerExists
} from '#decorators/Voice';
import { getAudio } from '#utils/voice';

@ApplyOptions<CommandOptions>({
    name: 'pause',
    description: 'Pause current track',
    requiredClientPermissions: ['SEND_MESSAGES'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class PauseCMD extends Command {

    @RequiredUserInVoice()
    @RequiredBotInVoice()
    @RequireSameVoiceChannel()
    @PlayerExists()
    public messageRun(message: Message) {
        const queue = getAudio(message.guild!);
        if (queue.paused) {
            queue.resume();
            return message.channel.send(`Resumed the music`);
        }
        queue.pause();
        return message.channel.send('⏸ Paused. To resume, run this command again');
    }
}