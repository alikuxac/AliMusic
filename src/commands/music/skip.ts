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
    name: 'skip',
    description: 'Skip current track',
    requiredClientPermissions: ['SendMessages'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class SkipCMD extends Command {

    @RequiredUserInVoice()
    @RequiredBotInVoice()
    @RequireSameVoiceChannel()
    @PlayerExists()
    public async messageRun(message: Message) {
        const queue = getAudio(message.guild!);
        
        await queue.skip();
        return message.channel.send('⏭ Skipped to the next Song');
    }
}