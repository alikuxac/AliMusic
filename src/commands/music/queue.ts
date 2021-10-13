import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: "queue",
    aliases: ['q'],
    description: "Check queue",
    requiredClientPermissions: ['EMBED_LINKS'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class QueueCMD extends Command {
    public async run(message: Message, args: Args) {
        const player = this.container.manager.players.get(message.guild?.id as string);
        if (!player) return message.reply('there is no player for this guild.');

        const page = await args.pick('number').catch(() => 0);

        const QueueEmbed = new MessageEmbed()
            .setAuthor(`Queue for ${message.guild?.name}  -  [ ${player.queue.length} Tracks ]`, message.guild?.iconURL({ dynamic: true }) as string);
        // get the right tracks of the current tracks
        const tracks = player.queue;
        // if there are no other tracks, information

        if (tracks.current) QueueEmbed.addField('Current', `**[${tracks.current.title}](${tracks.current.uri})**`);

        const multiple = 10;
        const end = page * multiple;
        const start = end - multiple;

        const arr = tracks.slice(start, end);
        if (!tracks.length) {
            QueueEmbed.setDescription(`No song in ${page > 1 ? `page ${page}` : 'the queue'}`);
        }
        else {
            QueueEmbed.setDescription(arr
                .map((track, i) => `${start + ++i} - [${track.title}](${track.uri})`)
                .join('\n'));
        }
        const maxPages = Math.ceil(tracks.length / multiple);

        QueueEmbed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
        QueueEmbed.setColor('RANDOM');
        QueueEmbed.setAuthor(
            ( message.member?.nickname ?? message.author.tag),
            message.author.displayAvatarURL({ dynamic: true }),
        );
        return message.channel.send({ embeds: [QueueEmbed] });
    }
}