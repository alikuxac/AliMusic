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
    name: "stop",
    description: "Stop current player",
    requiredClientPermissions: ['SEND_MESSAGES'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class StopCMD extends Command {
    
    @RequiredUserInVoice()
    @RequiredBotInVoice()
    @RequireSameVoiceChannel()
    @PlayerExists()
    public async messageRun(message: Message) {
        const queue = getAudio(message.guild!);
        await queue.stop();
        // send success message
        return message.channel.send('Stopped successfully');
    }
}