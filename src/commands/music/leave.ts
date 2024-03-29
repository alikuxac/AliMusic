import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import { Message } from 'discord.js';

import {
    RequiredUserInVoice,
    RequireSameVoiceChannel,
    RequiredBotInVoice,
} from '#decorators/Voice';
import { getAudio } from '#utils/voice';

@ApplyOptions<CommandOptions>({
    name: "leave",
    aliases: ['left'],
    description: "Leave the voice channel",
    requiredClientPermissions: ['EmbedLinks'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class LeaveCMD extends Command {

    @RequiredUserInVoice()
    @RequiredBotInVoice()
    @RequireSameVoiceChannel()
    public async messageRun(message: Message) {
        const queue = getAudio(message.guild!);
        if (!queue.voiceChannel) {
            return message.channel.send('I am not in a voice channel');
        }
        await queue.stop();
        queue.voice.leave();
        // send success message
        return message.channel.send('Left successfully');
    }
}

