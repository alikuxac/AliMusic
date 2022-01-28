import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import {
    RequiredUserInVoice,
    RequireSameVoiceChannel,
    RequiredBotInVoice,
    PlayerExists
} from '#decorators/Voice';
import { getAudio } from '#utils/voice';
@ApplyOptions<CommandOptions>({
    name: "queue",
    aliases: ['q'],
    description: "Check queue",
    requiredClientPermissions: ['EMBED_LINKS'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class QueueCMD extends Command {

    @RequiredUserInVoice()
    @RequiredBotInVoice()
    @RequireSameVoiceChannel()
    @PlayerExists()
    public async messageRun(message: Message, args: Args) {


        const page = await args.pick('number').catch(() => 0);
        const queue = getAudio(message.guild!);

        const QueueEmbed = new MessageEmbed()
            .setAuthor({ name: `Queue for ${message.guild?.name}  -  [ ${queue.songs.length} Tracks ]`, iconURL: <string>message.guild?.iconURL({ dynamic: true }) });
        // get the right tracks of the current tracks
        const tracks = queue.songs;
        // if there are no other tracks, information

        if (queue.playing) QueueEmbed.addField('Current', `**[${tracks[0].name}](${tracks[0].url})**`);

        const multiple = 10;
        const end = page * multiple;
        const start = end - multiple;

        const arr = tracks.slice(start, end);
        if (!tracks.length) {
            QueueEmbed.setDescription(`No song in ${page > 1 ? `page ${page}` : 'the queue'}`);
        }
        else {
            QueueEmbed.setDescription(arr
                .map((track, i) => `${start + ++i} - [${track.name}](${track.url})`)
                .join('\n'));
        }
        const maxPages = Math.ceil(tracks.length / multiple);

        QueueEmbed.setFooter({ text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}` });
        QueueEmbed.setColor('RANDOM');
        return message.channel.send({ embeds: [QueueEmbed] });
    }
}