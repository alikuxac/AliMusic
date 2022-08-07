import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';

import {
    RequiredUserInVoice,
    RequireSameVoiceChannel,
    RequiredBotInVoice,
    PlayerExists
} from '#decorators/Voice';
import { getAudio } from '#utils/voice';

@ApplyOptions<CommandOptions>({
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Check current track',
    requiredClientPermissions: ['EmbedLinks'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class NPCmd extends Command {

    @RequiredUserInVoice()
    @RequiredBotInVoice()
    @RequireSameVoiceChannel()
    @PlayerExists()
    public messageRun(message: Message) {
        const queue = getAudio(message.guild!);

        const current = queue.songs[0];
        const embed = new EmbedBuilder()
            .setAuthor({ name: current.member?.user.tag! })
            .setDescription(`Now playing: [${current?.name}](${current?.url}) (${current.formattedDuration})`)
            .setThumbnail(current?.thumbnail as string)
            .setFooter({ text: `Requested by ${current?.member?.user.tag}` });

        return message.channel.send({ embeds: [embed] });
    }
}